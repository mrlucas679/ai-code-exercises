// Performance-optimized payment processing system

interface PaymentProcessor {
    processPayment(amount: number, cardDetails: CreditCardDetails): Promise<PaymentResult>;
    refundPayment(transactionId: string, amount: number): Promise<RefundResult>;
}

interface CreditCardDetails {
    cardNumber: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
    cardholderName: string;
}

interface PaymentResult {
    success: boolean;
    transactionId?: string;
    errorMessage?: string;
    processingTime: number;  // Added for performance tracking
}

interface RefundResult {
    success: boolean;
    refundId?: string;
    errorMessage?: string;
    processingTime: number;  // Added for performance tracking
}

// Performance monitoring decorator
function measurePerformance() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const start = performance.now();
            try {
                const result = await originalMethod.apply(this, args);
                const end = performance.now();
                result.processingTime = end - start;
                return result;
            } catch (error) {
                const end = performance.now();
                return {
                    success: false,
                    errorMessage: error.message,
                    processingTime: end - start
                };
            }
        };

        return descriptor;
    };
}

// Connection pool for payment gateways
class ConnectionPool<T> {
    private pool: T[] = [];
    private activeConnections = 0;
    
    constructor(
        private factory: () => T,
        private maxSize: number,
        private validate: (conn: T) => boolean
    ) {}

    async acquire(): Promise<T> {
        if (this.pool.length > 0) {
            const conn = this.pool.pop()!;
            if (this.validate(conn)) {
                return conn;
            }
        }

        if (this.activeConnections < this.maxSize) {
            this.activeConnections++;
            return this.factory();
        }

        throw new Error('Connection pool exhausted');
    }

    release(conn: T) {
        if (this.pool.length < this.maxSize && this.validate(conn)) {
            this.pool.push(conn);
        } else {
            this.activeConnections--;
        }
    }
}

// Optimized payment service with connection pooling and caching
class OptimizedPaymentService implements PaymentProcessor {
    private stripePool: ConnectionPool<any>;
    private paypalPool: ConnectionPool<any>;
    private cache = new Map<string, PaymentResult>();
    private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

    constructor(maxPoolSize: number = 10) {
        this.stripePool = new ConnectionPool(
            () => new StripeAPI(),
            maxPoolSize,
            (conn) => conn !== null
        );

        this.paypalPool = new ConnectionPool(
            () => new PayPalAPI(),
            maxPoolSize,
            (conn) => conn !== null
        );
    }

    private getCacheKey(amount: number, cardDetails: CreditCardDetails): string {
        return `${amount}-${cardDetails.cardNumber}-${cardDetails.expiryMonth}-${cardDetails.expiryYear}`;
    }

    @measurePerformance()
    async processPayment(amount: number, cardDetails: CreditCardDetails): Promise<PaymentResult> {
        const cacheKey = this.getCacheKey(amount, cardDetails);
        
        // Check cache for recent successful transactions
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.processingTime < this.cacheTimeout) {
            return { ...cached, fromCache: true };
        }

        let gateway: any;
        let pool: ConnectionPool<any>;

        try {
            // Choose payment gateway based on card number pattern
            if (cardDetails.cardNumber.startsWith('4')) {
                pool = this.stripePool;
            } else {
                pool = this.paypalPool;
            }

            gateway = await pool.acquire();

            const result = cardDetails.cardNumber.startsWith('4')
                ? await this.processWithStripe(gateway, amount, cardDetails)
                : await this.processWithPaypal(gateway, amount, cardDetails);

            // Cache successful results
            if (result.success) {
                this.cache.set(cacheKey, result);
            }

            return result;
        } finally {
            if (gateway && pool) {
                pool.release(gateway);
            }
        }
    }

    @measurePerformance()
    async refundPayment(transactionId: string, amount: number): Promise<RefundResult> {
        let gateway: any;
        let pool: ConnectionPool<any>;

        try {
            if (transactionId.startsWith('stripe_')) {
                pool = this.stripePool;
                gateway = await pool.acquire();
                return await this.refundWithStripe(gateway, transactionId, amount);
            } else {
                pool = this.paypalPool;
                gateway = await pool.acquire();
                return await this.refundWithPaypal(gateway, transactionId, amount);
            }
        } finally {
            if (gateway && pool) {
                pool.release(gateway);
            }
        }
    }

    private async processWithStripe(gateway: any, amount: number, cardDetails: CreditCardDetails): Promise<PaymentResult> {
        const start = performance.now();
        try {
            const result = await gateway.createCharge(
                amount * 100,
                {
                    cc_number: cardDetails.cardNumber,
                    exp_month: cardDetails.expiryMonth,
                    exp_year: cardDetails.expiryYear,
                    cvc: cardDetails.cvv,
                    name: cardDetails.cardholderName
                }
            );

            return {
                success: result.status === 'succeeded',
                transactionId: result.id,
                errorMessage: result.error?.message,
                processingTime: performance.now() - start
            };
        } catch (error) {
            return {
                success: false,
                errorMessage: error.message,
                processingTime: performance.now() - start
            };
        }
    }

    private async processWithPaypal(gateway: any, amount: number, cardDetails: CreditCardDetails): Promise<PaymentResult> {
        const start = performance.now();
        try {
            const formattedExpiry = `${String(cardDetails.expiryMonth).padStart(2, '0')}/${String(cardDetails.expiryYear).slice(-2)}`;
            const result = await gateway.submitPayment({
                amount,
                card: {
                    number: cardDetails.cardNumber,
                    expiration: formattedExpiry,
                    securityCode: cardDetails.cvv,
                    holder: cardDetails.cardholderName
                }
            });

            return {
                success: result.successful,
                transactionId: result.paymentId,
                errorMessage: result.failureReason,
                processingTime: performance.now() - start
            };
        } catch (error) {
            return {
                success: false,
                errorMessage: error.message,
                processingTime: performance.now() - start
            };
        }
    }

    private async refundWithStripe(gateway: any, transactionId: string, amount: number): Promise<RefundResult> {
        const start = performance.now();
        try {
            const result = await gateway.createRefund(transactionId, amount * 100);
            return {
                success: result.status === 'succeeded',
                refundId: result.id,
                errorMessage: result.error?.message,
                processingTime: performance.now() - start
            };
        } catch (error) {
            return {
                success: false,
                errorMessage: error.message,
                processingTime: performance.now() - start
            };
        }
    }

    private async refundWithPaypal(gateway: any, transactionId: string, amount: number): Promise<RefundResult> {
        const start = performance.now();
        try {
            const result = await gateway.refund(transactionId, amount);
            return {
                success: result.successful,
                refundId: result.refundId,
                errorMessage: result.failureReason,
                processingTime: performance.now() - start
            };
        } catch (error) {
            return {
                success: false,
                errorMessage: error.message,
                processingTime: performance.now() - start
            };
        }
    }
}

// Example usage with performance monitoring
async function runPerformanceTest() {
    const paymentService = new OptimizedPaymentService(5);
    const cardDetails: CreditCardDetails = {
        cardNumber: '4111111111111111',
        expiryMonth: 12,
        expiryYear: 2025,
        cvv: '123',
        cardholderName: 'John Doe'
    };

    console.log('Starting performance test...');
    console.time('Total test time');

    // Test multiple concurrent payments
    const promises = Array(10).fill(null).map((_, i) => 
        paymentService.processPayment(99.99 + i, cardDetails)
            .then(result => {
                console.log(`Payment ${i + 1} processed in ${result.processingTime}ms`);
                return result;
            })
    );

    const results = await Promise.all(promises);
    const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;

    console.timeEnd('Total test time');
    console.log(`Average processing time: ${avgProcessingTime.toFixed(2)}ms`);
}

runPerformanceTest().catch(console.error);


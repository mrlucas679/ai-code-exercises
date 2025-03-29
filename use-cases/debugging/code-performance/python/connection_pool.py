class DatabaseConnectionPool:
    def __init__(self, db_type, host, port, username, password, database,
               pool_size=5, connection_timeout=30, retry_attempts=3,
               use_ssl=False, charset='utf8'):
        self.db_type = db_type
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.database = database
        self.pool_size = pool_size  # Maximum number of connections in the pool
        self.connection_timeout = connection_timeout
        self.retry_attempts = retry_attempts
        self.use_ssl = use_ssl
        self.charset = charset
        self.active_connections = 0
        self.connection_pool = []
        
    def _create_connection_string(self):
        """Generate connection string based on database type with performance options"""
        if self.db_type == 'mysql':
            conn_str = (f"mysql://{self.username}:{self.password}@{self.host}:"
                      f"{self.port}/{self.database}?charset={self.charset}"
                      f"&connectionTimeout={self.connection_timeout}"
                      f"&pooling=true&maxPoolSize={self.pool_size}"
                      f"&connectionReuseLimit=100")  # Limit connection reuse for stability
            
            if self.use_ssl:
                conn_str += "&useSSL=true"
            return conn_str
            
        elif self.db_type == 'postgresql':
            conn_str = (f"postgresql://{self.username}:{self.password}@{self.host}:"
                      f"{self.port}/{self.database}?pool={self.pool_size}"
                      f"&timeout={self.connection_timeout}")
            
            if self.use_ssl:
                conn_str += "&sslmode=require"
            return conn_str
            
        elif self.db_type == 'mongodb':
            conn_str = (f"mongodb://{self.username}:{self.password}@{self.host}:"
                      f"{self.port}/{self.database}?retryAttempts={self.retry_attempts}"
                      f"&maxPoolSize={self.pool_size}"
                      f"&connectTimeoutMS={self.connection_timeout * 1000}"
                      f"&socketTimeoutMS=30000")  # Socket timeout for long-running queries
            
            if self.use_ssl:
                conn_str += "&ssl=true"
            return conn_str
        
        raise ValueError(f"Unsupported database type: {self.db_type}")
        
    def get_connection(self):
        """Get a connection from the pool with performance monitoring"""
        import time
        start_time = time.time()
        
        # Try to reuse an existing connection from the pool
        if self.connection_pool:
            conn = self.connection_pool.pop()
            acquisition_time = time.time() - start_time
            print(f"Connection acquired from pool in {acquisition_time:.3f} seconds")
            return conn
        
        # Create new connection if pool is empty and we haven't reached max size
        if self.active_connections < self.pool_size:
            conn_str = self._create_connection_string()
            # In a real implementation, we would create actual database connection here
            print(f"Creating new connection: {conn_str}")
            self.active_connections += 1
            creation_time = time.time() - start_time
            print(f"New connection created in {creation_time:.3f} seconds")
            return {"connection": "simulated", "created_at": time.time()}
        
        raise Exception("Connection pool exhausted")
        
    def release_connection(self, connection):
        """Return a connection to the pool"""
        if len(self.connection_pool) < self.pool_size:
            self.connection_pool.append(connection)
            print("Connection returned to pool")
        else:
            self.active_connections -= 1
            print("Connection closed (pool full)")

# Example usage demonstration with performance monitoring
if __name__ == "__main__":
    import time
    
    # Create a connection pool with performance-optimized settings
    pool = DatabaseConnectionPool(
        db_type='postgresql',
        host='localhost',
        port=5432,
        username='user',
        password='password',
        database='app_db',
        pool_size=10,
        connection_timeout=5,  # Shorter timeout for faster failure detection
        retry_attempts=3
    )
    
    # Simulate high-concurrency scenario
    connections = []
    start_time = time.time()
    
    # Try to acquire multiple connections
    for i in range(15):  # Trying to get more than pool_size
        try:
            conn = pool.get_connection()
            connections.append(conn)
            print(f"Acquired connection {i + 1}")
        except Exception as e:
            print(f"Failed to acquire connection: {e}")
        
        # Simulate some work
        time.sleep(0.1)
    
    # Release connections back to pool
    for conn in connections:
        pool.release_connection(conn)
        time.sleep(0.05)  # Simulate staggered release
    
    total_time = time.time() - start_time
    print(f"\nTotal operation time: {total_time:.2f} seconds")
    print(f"Final active connections: {pool.active_connections}")
    print(f"Final pool size: {len(pool.connection_pool)}")


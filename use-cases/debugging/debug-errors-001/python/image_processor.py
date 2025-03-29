import numpy as np
from PIL import Image
import os
import gc
import psutil
from typing import List, Optional, Tuple
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ImageProcessor:
    """
    Example class demonstrating common debugging scenarios in image processing.
    Includes both problematic and memory-optimized implementations.
    """

    @staticmethod
    def load_and_process_buggy(image_path: str) -> np.ndarray:
        """
        Problematic implementation that creates memory issues.
        This will cause memory problems with large images or multiple calls.
        """
        # Load the image
        img = Image.open(image_path)

        # Process the image - creates a very large array
        # The dtype=float64 and large dimensions cause memory issues
        image_data = [[[float(x) for x in range(64)] 
                     for _ in range(5000)] 
                     for _ in range(5000)]

        return np.array(image_data)

    @staticmethod
    def load_and_process_fixed(image_path: str) -> np.ndarray:
        """
        Fixed implementation with proper memory management.
        """
        try:
            # Load the image
            with Image.open(image_path) as img:
                # Convert to numpy array with more efficient data type
                image_data = np.array(img, dtype=np.float32)
                return image_data
        except Exception as e:
            logger.error(f"Error processing image {image_path}: {str(e)}")
            raise

    @staticmethod
    def load_and_process_enhanced(
        image_path: str,
        max_size: Optional[Tuple[int, int]] = None,
        dtype: np.dtype = np.float32
    ) -> np.ndarray:
        """
        Enhanced implementation with memory monitoring, size limits,
        and resource cleanup.
        """
        try:
            # Check file existence and size
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image file not found: {image_path}")

            file_size = os.path.getsize(image_path) / (1024 * 1024)  # Size in MB
            logger.info(f"Processing image {image_path} ({file_size:.2f} MB)")

            # Check available memory
            available_memory = psutil.virtual_memory().available / (1024 * 1024)  # MB
            logger.info(f"Available memory: {available_memory:.2f} MB")

            if file_size * 4 > available_memory:  # Estimate memory needed
                raise MemoryError(
                    f"Not enough memory to process image. "
                    f"Need {file_size * 4:.2f} MB, have {available_memory:.2f} MB"
                )

            # Load and process image
            with Image.open(image_path) as img:
                # Resize if needed
                if max_size and (img.width > max_size[0] or img.height > max_size[1]):
                    img.thumbnail(max_size, Image.LANCZOS)
                    logger.info(f"Resized image to {img.size}")

                # Convert to array with specified dtype
                image_data = np.array(img, dtype=dtype)

                # Force garbage collection
                gc.collect()

                return image_data

        except Exception as e:
            logger.error(f"Error processing image {image_path}: {str(e)}")
            # Force garbage collection on error
            gc.collect()
            raise

    @staticmethod
    def process_batch_enhanced(
        image_paths: List[str],
        max_size: Optional[Tuple[int, int]] = None,
        max_batch_size: int = 10
    ) -> List[np.ndarray]:
        """
        Process multiple images with batch size limit and memory monitoring.
        """
        results = []
        total_images = len(image_paths)

        for i in range(0, total_images, max_batch_size):
            batch = image_paths[i:i + max_batch_size]
            logger.info(f"Processing batch {i//max_batch_size + 1} "
                      f"({len(batch)} images)")

            batch_results = []
            for image_path in batch:
                try:
                    result = ImageProcessor.load_and_process_enhanced(
                        image_path,
                        max_size=max_size
                    )
                    batch_results.append(result)
                except Exception as e:
                    logger.error(f"Error in batch processing: {str(e)}")
                    continue

            results.extend(batch_results)

            # Memory cleanup after each batch
            gc.collect()
            available_memory = psutil.virtual_memory().available / (1024 * 1024)
            logger.info(f"Available memory after batch: {available_memory:.2f} MB")

        return results

def demonstrate_image_processing():
    """
    Demonstrates the different implementations and their behavior.
    """
    # Test data
    test_image_path = "test_image.jpg"  # Replace with actual test image
    test_image_paths = [test_image_path] * 3  # Multiple copies for batch testing

    # Test buggy version
    print("\nTesting buggy version (may cause memory issues):")
    try:
        result_buggy = ImageProcessor.load_and_process_buggy(test_image_path)
        print(f"Buggy version result shape: {result_buggy.shape}")
    except Exception as e:
        print(f"Buggy version error: {str(e)}")

    # Test fixed version
    print("\nTesting fixed version:")
    try:
        result_fixed = ImageProcessor.load_and_process_fixed(test_image_path)
        print(f"Fixed version result shape: {result_fixed.shape}")
    except Exception as e:
        print(f"Fixed version error: {str(e)}")

    # Test enhanced version
    print("\nTesting enhanced version:")
    try:
        result_enhanced = ImageProcessor.load_and_process_enhanced(
            test_image_path,
            max_size=(1024, 1024)
        )
        print(f"Enhanced version result shape: {result_enhanced.shape}")
    except Exception as e:
        print(f"Enhanced version error: {str(e)}")

    # Test batch processing
    print("\nTesting batch processing:")
    try:
        results_batch = ImageProcessor.process_batch_enhanced(
            test_image_paths,
            max_size=(1024, 1024),
            max_batch_size=2
        )
        print(f"Batch processing results: {len(results_batch)} images processed")
    except Exception as e:
        print(f"Batch processing error: {str(e)}")

if __name__ == "__main__":
    demonstrate_image_processing()


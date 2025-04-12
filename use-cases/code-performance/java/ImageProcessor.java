// ImageProcessor.java
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ImageProcessor {

    public static void main(String[] args) {
        // Simulate processing a batch of images
        try {
            processImageFolder("sample_images", "processed_images");
        } catch (OutOfMemoryError e) {
            System.err.println("Out of memory error occurred: " + e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            System.err.println("IO error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static void processImageFolder(String inputFolder, String outputFolder) throws IOException {
        File folder = new File(inputFolder);
        File[] imageFiles = folder.listFiles((dir, name) ->
                name.toLowerCase().endsWith(".jpg") ||
                name.toLowerCase().endsWith(".png"));

        if (imageFiles == null || imageFiles.length == 0) {
            System.out.println("No images found in the folder");
            return;
        }

        // Create output directory if it doesn't exist
        File outputDir = new File(outputFolder);
        if (!outputDir.exists()) {
            outputDir.mkdirs();
        }

        // Store all images in memory first
        List<BufferedImage> images = new ArrayList<>();
        System.out.println("Loading all images into memory...");

        for (File imageFile : imageFiles) {
            BufferedImage image = ImageIO.read(imageFile);
            images.add(image);
            System.out.println("Loaded: " + imageFile.getName());
        }

        // Process all images
        System.out.println("Processing all images...");
        List<BufferedImage> processedImages = new ArrayList<>();

        for (BufferedImage image : images) {
            BufferedImage processed = applyEffects(image);
            processedImages.add(processed);
        }

        // Save all processed images
        System.out.println("Saving all processed images...");
        for (int i = 0; i < imageFiles.length; i++) {
            String outputName = outputFolder + File.separator + "processed_" + imageFiles[i].getName();
            ImageIO.write(processedImages.get(i), getImageFormat(imageFiles[i].getName()), new File(outputName));
            System.out.println("Saved: " + outputName);
        }

        System.out.println("All images processed successfully");
    }

    private static BufferedImage applyEffects(BufferedImage original) {
        // Simulate memory-intensive image processing
        int width = original.getWidth();
        int height = original.getHeight();

        // Create a new image with the same dimensions
        BufferedImage processed = new BufferedImage(width, height, original.getType());

        // Process each pixel - simple grayscale conversion for this example
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int rgb = original.getRGB(x, y);

                int alpha = (rgb >> 24) & 0xff;
                int red = (rgb >> 16) & 0xff;
                int green = (rgb >> 8) & 0xff;
                int blue = rgb & 0xff;

                // Convert to grayscale
                int gray = (red + green + blue) / 3;

                // Set new RGB
                int newRGB = (alpha << 24) | (gray << 16) | (gray << 8) | gray;
                processed.setRGB(x, y, newRGB);
            }
        }

        return processed;
    }

    private static String getImageFormat(String filename) {
        if (filename.toLowerCase().endsWith(".png")) {
            return "png";
        } else {
            return "jpeg";
        }
    }
}
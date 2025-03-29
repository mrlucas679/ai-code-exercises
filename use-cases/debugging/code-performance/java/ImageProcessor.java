import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ImageProcessor {
    public static void processImageFolder(String inputFolder, String outputFolder) throws IOException {
        File input = new File(inputFolder);
        File output = new File(outputFolder);
        output.mkdirs();

        if (input.isDirectory()) {
            File[] files = input.listFiles((dir, name) -> 
                name.toLowerCase().endsWith(".jpg") || 
                name.toLowerCase().endsWith(".png"));
            
            if (files != null) {
                for (File file : files) {
                    try {
                        BufferedImage image = ImageIO.read(file);
                        // Process image here
                        File outputFile = new File(output, "processed_" + file.getName());
                        ImageIO.write(image, "png", outputFile);
                    } catch (OutOfMemoryError e) {
                        System.err.println("Memory error processing " + file.getName());
                        throw e;
                    }
                }
            }
        }
    }

    public static void main(String[] args) {
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
}


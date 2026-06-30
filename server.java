import java.io.*;
import java.net.*;
import java.nio.file.Files;

public class server {

    public static void main(String[] args) {
        int puerto = 8000;

        try {
            ServerSocket servidor = new ServerSocket();
            servidor.bind(new InetSocketAddress("0.0.0.0", puerto));

            System.out.println("Servidor iniciado");
            System.out.println("PC: http://localhost:" + puerto);
            System.out.println("Móvil: http://TU_IP:" + puerto);

            while (true) {
                Socket socket = servidor.accept();

                new Thread(() -> manejarCliente(socket)).start();
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void manejarCliente(Socket socket) {
        try (
            BufferedReader in = new BufferedReader(
                new InputStreamReader(socket.getInputStream())
            );
            OutputStream out = socket.getOutputStream()
        ) {

            System.out.println("\nNueva conexión desde: " + socket.getInetAddress());

            String peticion = in.readLine();

            if (peticion == null || peticion.isEmpty()) {
                System.out.println("Petición vacía");
                return;
            }

            System.out.println("HTTP: " + peticion);

            String[] partes = peticion.split(" ");
            String ruta = partes.length > 1 ? partes[1] : "/";

            if (ruta.equals("/")) {
                ruta = "/index.html";
            }

            File archivo = new File("." + ruta);

            if (archivo.exists() && archivo.isFile()) {

                byte[] datos = Files.readAllBytes(archivo.toPath());

                String tipo = obtenerTipoContenido(archivo.getName());

                String cabecera =
                    "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: " + tipo + "\r\n" +
                    "Content-Length: " + datos.length + "\r\n" +
                    "Connection: close\r\n\r\n";

                out.write(cabecera.getBytes());
                out.write(datos);

                System.out.println("Enviado: " + archivo.getName());

            } else {

                String mensaje = "<h1>404 - Archivo no encontrado</h1>";
                byte[] datos = mensaje.getBytes();

                String cabecera =
                    "HTTP/1.1 404 Not Found\r\n" +
                    "Content-Type: text/html; charset=UTF-8\r\n" +
                    "Content-Length: " + datos.length + "\r\n" +
                    "Connection: close\r\n\r\n";

                out.write(cabecera.getBytes());
                out.write(datos);

                System.out.println("404: " + ruta);
            }

            out.flush();

        } catch (IOException e) {
            System.out.println("Error con cliente:");
            e.printStackTrace();

        } finally {
            try {
                socket.close();
            } catch (IOException e) {
                // Ignorar
            }
        }
    }


    private static String obtenerTipoContenido(String nombre) {

        nombre = nombre.toLowerCase();

        if (nombre.endsWith(".html") || nombre.endsWith(".htm")) {
            return "text/html; charset=UTF-8";
        }

        if (nombre.endsWith(".css")) {
            return "text/css";
        }

        if (nombre.endsWith(".js")) {
            return "application/javascript";
        }

        if (nombre.endsWith(".png")) {
            return "image/png";
        }

        if (nombre.endsWith(".jpg") || nombre.endsWith(".jpeg")) {
            return "image/jpeg";
        }

        if (nombre.endsWith(".gif")) {
            return "image/gif";
        }

        if (nombre.endsWith(".svg")) {
            return "image/svg+xml";
        }

        if (nombre.endsWith(".json")) {
            return "application/json";
        }

        return "application/octet-stream";
    }
}
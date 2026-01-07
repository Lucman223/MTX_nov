# 🚀 Guía de Inicio: Demo MotoTX (Acceso Remoto)

Esta guía explica cómo arrancar la plataforma y acceder desde cualquier dispositivo (PC o Móvil) para demostraciones.

## 1. Cómo Iniciar (En tu PC)

Para poner en marcha todos los servicios, solo tienes que seguir estos pasos:

1.  Abre la carpeta del proyecto en tu PC.
2.  Busca el archivo **`INICIAR_DEMO.bat`**.
3.  Haz **doble clic** sobre él.

### ¿Qué hace este script?
*   **Limpia**: Cierra procesos antiguos de PHP o Node para evitar errores.
*   **Compila**: Genera los archivos más recientes de la App (Vite).
*   **Arranca**: Inicia el servidor Laravel y el sistema de WebSockets (notificaciones).
*   **Conecta**: Crea un túnel seguro a internet para que puedas entrar desde el móvil.

---

## 2. Cómo Acceder desde el Móvil

Una vez que el script esté funcionando (verás varias ventanas negras), sigue estos pasos en el móvil:

1.  Abre el navegador (Chrome o Safari) y ve a:
    👉 **`https://mototx-bko-live.loca.lt`**
2.  Si la página te pide una **"Tunnel Password"**:
    *   Mira la ventana de tu PC. Verás un mensaje que dice: `TU PASSWORD DEL TUNEL ES: XX.XX.XX.XX`.
    *   Escribe esos números en el móvil y dale a **Submit**.
3.  **Listo!** Ya puedes navegar por la App.

---

## 3. Credenciales de Prueba

| Rol | Usuario (Email) | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@test.com` | `admin123` |
| **Motorista** | `motorista@test.com` | `password` |
| **Cliente** | `cliente@test.com` | `password` |

---

## ⚠️ Notas Importantes
*   **No cierres las ventanas negras**: Si las cierras, la App dejará de funcionar en el móvil.
*   **Modo Incógnito**: Si notas que no se actualizan los cambios en el móvil, usa una pestaña de incógnito.
*   **Cambio de IP**: El "Password" (tu IP pública) puede cambiar si reinicias tu router, así que comprueba siempre el número que sale en la ventana negra.

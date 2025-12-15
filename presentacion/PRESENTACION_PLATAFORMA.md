# Presentación de la Plataforma MotoTX

Bienvenido a la documentación visual de **MotoTX**, una plataforma integral de transporte en moto que conecta a clientes con motoristas de manera eficiente y segura.

A continuación, se detalla el flujo de usuario y las funcionalidades clave para cada rol dentro del sistema.

---

## 1. Vistas Generales

### Página de Inicio (Landing Page)
La puerta de entrada a la plataforma. Presenta la propuesta de valor, permite el acceso rápido al registro e inicio de sesión, y ofrece información general sobre el servicio.
![Home Page](general_home.png)

### Registro de Usuarios
Un formulario unificado que permite a los nuevos usuarios registrarse seleccionando su rol (Cliente o Motorista). Diseño limpio y validación en tiempo real.
![Registro de Usuario](general_registro.png)

---

## 2. Rol: Cliente
El cliente es el usuario final que solicita el servicio de transporte.

### Dashboard de Cliente
El panel principal donde el cliente puede:
- Ver su saldo de viajes disponibles (Forfaits).
- Solicitar un nuevo viaje seleccionando origen y destino en el mapa interactivo.
- Ver el estado de su solicitud actual.
![Dashboard Cliente](cliente_dashboard.png)

### Compra de Forfaits
Sección dedicada a la recarga de viajes. Los clientes pueden adquirir paquetes de viajes (forfaits) utilizando pasarelas de pago integradas (Simulación Orange Money).
![Compra de Forfaits](cliente_forfaits.png)

### Historial de Viajes
Registro completo de los viajes realizados, con detalles como fecha, motorista asignado, y estado del viaje.
![Historial Cliente](cliente_historial.png)

### Perfil de Usuario
Gestión de datos personales, contraseña y preferencias de la cuenta.
![Perfil Cliente](cliente_perfil.png)

---

## 3. Rol: Motorista
El motorista es el proveedor del servicio, encargado de aceptar y realizar los viajes.

### Dashboard de Motorista
Herramienta de trabajo diaria. Permite:
- Ponerse "En Línea" u "Offline" para recibir solicitudes.
- Ver y aceptar nuevas solicitudes de viaje en tiempo real.
- Gestionar el estado del viaje actual (Aceptar -> En Curso -> Completar).
![Dashboard Motorista](motorista_dashboard.png)

### Historial de Servicios
Bitácora de todos los viajes completados por el motorista, útil para llevar un control de su actividad.
![Historial Motorista](motorista_historial.png)

### Perfil de Motorista
Información del conductor.
![Perfil Motorista](motorista_perfil.png)

---

## 4. Rol: Administrador
El administrador tiene control total sobre la plataforma, gestionando usuarios, finanzas y configuraciones.

### Dashboard de Administración
Visión global del estado del sistema. Muestra KPIs importantes como:
- Total de motoristas y clientes.
- Ingresos del mes.
- Gráficos de actividad y rendimiento.
![Dashboard Admin](admin_dashboard.png)

### Gestión de Clientes
Tabla completa con todos los clientes registrados, permitiendo ver detalles y gestionar cuentas.
![Gestión Clientes](admin_clientes.png)

### Gestión de Motoristas
Control de la flota. Permite validar nuevos motoristas, ver su estado (activo/inactivo) y gestionar sus perfiles.
![Gestión Motoristas](admin_motoristas.png)

### Gestión de Forfaits
Configuración de los paquetes de viajes y precios disponibles para los clientes.
![Gestión Forfaits](admin_forfaits.png)

### Historial Global de Viajes
Supervisión de todos los viajes realizados en la plataforma, con filtros por estado, fecha y usuario.
![Historial Global](admin_viajes.png)

### Reportes y Análisis
Sección avanzada para la toma de decisiones basada en datos, con reportes detallados sobre el uso de la plataforma.
![Reportes](admin_reportes.png)

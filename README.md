# Fintrack — Dashboard de Finanzas Personales

Fintrack es un panel de control para la gestión inteligente de **ingresos, gastos y metas de ahorro**, construido con **Next.js, Supabase y TailwindCSS**.  
Este proyecto nace como un **MVP** orientado a proporcionar claridad financiera y ayudar a los usuarios a tomar mejores decisiones con su dinero.

---

## 🚀 Características principales (MVP) 

### 🔐 Autenticación
- Registro e inicio de sesión con **Supabase Auth**
- Dashboard protegido mediante middleware
- Manejo seguro de sesiones

### 💰 Gestión de ingresos
- CRUD de ingresos
- Clasificación por **4 ramas**:
  1. Gasto fijo  
  2. Gasto variable  
  3. Diversión  
  4. Ahorro y fondos  
- Soporte para ingresos recurrentes
- Cálculo automático del total por rama

### 💸 Gestión de gastos
- CRUD de gastos
- Categorías personalizadas por usuario
- Filtros por fecha, categoría y método de pago
- Lista paginada o con scroll infinito
- Cálculo del gasto mensual

### 🎯 Metas de ahorro y fondos especiales
- Crear metas como:
  - Fondo de emergencia
  - Ahorros para objetivos específicos
- Cada meta incluye:
  - Monto objetivo
  - Monto actual acumulado
  - Progreso porcentual
  - Transacciones de aportación

### 📊 Dashboard financiero
Incluye:
- Total de ingresos
- Total de gastos
- Saldo disponible
- % de gasto sobre ingreso
- Indicador de salud financiera:
  - Verde < 60%  
  - Amarillo < 80%  
  - Rojo > 90%  
- Gráfica de ingresos vs gastos
- Distribución de gastos por categoría

---

## 🧱 Tecnologías utilizadas

- **Next.js 14 (App Router)**
- **Supabase (Auth + Database)**
- **TailwindCSS**
- **TypeScript**
- **Recharts / Chart.js** para gráficas
- **Shadcn/UI** para componentes
- **Zod** para validaciones

---

## 📂 Estructura sugerida del proyecto


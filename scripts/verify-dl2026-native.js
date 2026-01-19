const { verifyPassword, hashPassword } = require('../lib/security');

async function check() {
    const password = "DL2026";
    const storedHash = process.env.PORTFOLIO_PASSWORD_HASH;
    const storedPlain = process.env.PORTFOLIO_PASSWORD;

    console.log("--- Diagnóstico de Autenticación Local ---");
    console.log("Probando contraseña:", password);

    let isValid = false;
    if (storedHash) {
        console.log("Método configurado: HASH (detectado)");
        isValid = await verifyPassword(password, storedHash);
    } else if (storedPlain) {
        console.log("Método configurado: TEXTO PLANO (detectado - inseguro)");
        isValid = (password === storedPlain);
    } else {
        console.log("¡ERROR! No se detectó ninguna configuración de contraseña en .env.local");
    }

    console.log("Resultado de validación local:", isValid ? "✅ ÉXITO" : "❌ FALLO");

    console.log("\n--- Generación de Hash para Producción ---");
    const newHash = await hashPassword(password);
    console.log("Si deseas usar esta contraseña, configura PORTFOLIO_PASSWORD_HASH con este valor:");
    console.log(newHash);
}

check();

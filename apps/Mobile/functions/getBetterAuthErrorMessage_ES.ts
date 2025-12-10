export const errorCodes = {
	// Errores de autenticación general
	INVALID_EMAIL_OR_PASSWORD: "Credenciales incorrectas. Verifica tu correo y contraseña.",
	INVALID_PASSWORD: "Contraseña incorrecta.",
	INVALID_EMAIL: "Correo electrónico inválido.",
	EMAIL_INVALID: "Correo electrónico inválido.",
	USER_NOT_FOUND: "No se encontró una cuenta con ese correo electrónico.",
	UNAUTHORIZED: "No tienes autorización para realizar esta acción.",
	
	// Errores de registro
	USER_ALREADY_EXISTS: "Este correo ya está registrado. Intenta iniciar sesión.",
	EMAIL_ALREADY_EXISTS: "Ya existe una cuenta con este correo electrónico.",
	WEAK_PASSWORD: "La contraseña debe tener al menos 8 caracteres.",
	PASSWORD_TOO_SHORT: "La contraseña es demasiado corta.",
	PASSWORD_TOO_LONG: "La contraseña es demasiado larga.",
	
	// Errores de verificación y tokens
	INVALID_TOKEN: "El enlace de verificación ha expirado o es inválido.",
	TOKEN_EXPIRED: "El token ha expirado. Solicita uno nuevo.",
	VERIFICATION_TOKEN_NOT_FOUND: "Token de verificación no encontrado.",
	EMAIL_NOT_VERIFIED: "Por favor verifica tu correo electrónico.",
	
	// Errores de sesión
	SESSION_NOT_FOUND: "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
	SESSION_EXPIRED: "Tu sesión ha expirado.",
	INVALID_SESSION: "Sesión inválida.",
	
	// Errores de 2FA
	TWO_FACTOR_NOT_ENABLED: "La autenticación de dos factores no está habilitada.",
	TOTP_NOT_ENABLED: "TOTP no está habilitado.",
	OTP_NOT_ENABLED: "OTP no está habilitado.",
	OTP_HAS_EXPIRED: "El código OTP ha expirado. Solicita uno nuevo.",
	INVALID_CODE: "Código de verificación inválido.",
	INVALID_BACKUP_CODE: "Código de respaldo inválido.",
	BACKUP_CODES_NOT_ENABLED: "Los códigos de respaldo no están habilitados.",
	TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: "Demasiados intentos. Por favor solicita un nuevo código.",
	INVALID_TWO_FACTOR_COOKIE: "Cookie de dos factores inválida.",
	
	// Errores de OAuth/Google
	OAUTH_ERROR: "Error al autenticar con el proveedor externo.",
	OAUTH_CALLBACK_ERROR: "Error en la respuesta del proveedor de autenticación.",
	INVALID_OAUTH_CONFIGURATION: "Configuración de OAuth inválida.",
	OAUTH_ACCESS_DENIED: "Acceso denegado por el proveedor.",
	OAUTH_ACCOUNT_NOT_LINKED: "Esta cuenta no está vinculada a ningún usuario.",
	ACCOUNT_ALREADY_LINKED: "Esta cuenta ya está vinculada a otro usuario.",
	PROVIDER_NOT_CONFIGURED: "El proveedor de autenticación no está configurado.",
	
	// Errores de rate limiting
	TOO_MANY_REQUESTS: "Demasiados intentos. Intenta de nuevo más tarde.",
	RATE_LIMIT_EXCEEDED: "Has excedido el límite de solicitudes. Intenta más tarde.",
	
	// Errores de cambio de email/password
	SAME_PASSWORD: "La nueva contraseña no puede ser igual a la anterior.",
	SAME_EMAIL: "El nuevo correo no puede ser igual al actual.",
	CURRENT_PASSWORD_INCORRECT: "La contraseña actual es incorrecta.",
	
	// Errores de permisos (Admin plugin)
	FORBIDDEN: "No tienes permisos para realizar esta acción.",
	YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: "No tienes permisos para cambiar roles de usuario.",
	YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: "No tienes permisos para crear usuarios.",
	YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: "No tienes permisos para eliminar usuarios.",
	BANNED_USER: "Has sido suspendido de esta aplicación. Contacta a soporte si crees que es un error.",
	YOU_CANNOT_BAN_YOURSELF: "No puedes suspenderte a ti mismo.",
	YOU_CANNOT_REMOVE_YOURSELF: "No puedes eliminarte a ti mismo.",
	
	// Errores de contraseñas comprometidas (Have I Been Pwned)
	PASSWORD_COMPROMISED: "Esta contraseña ha sido comprometida en filtraciones de datos. Por favor elige una contraseña diferente.",
	
	// Errores de red/servidor
	NETWORK_ERROR: "Error de conexión. Verifica tu internet.",
	INTERNAL_SERVER_ERROR: "Error interno del servidor. Intenta de nuevo más tarde.",
	SERVICE_UNAVAILABLE: "El servicio no está disponible en este momento.",
	
	// Errores genéricos
	UNKNOWN_ERROR: "Ha ocurrido un error inesperado.",
	INVALID_REQUEST: "Solicitud inválida.",
	BAD_REQUEST: "Solicitud incorrecta.",
	NOT_FOUND: "Recurso no encontrado.",
};

const getBetterAuthErrorMessage_ES = (code: string) => {
	if (code in errorCodes) {
		return errorCodes[code as keyof typeof errorCodes];
	}
	// Mensaje por defecto si no se encuentra el código
	return "Ha ocurrido un error. Por favor intenta de nuevo.";
};

export default getBetterAuthErrorMessage_ES;
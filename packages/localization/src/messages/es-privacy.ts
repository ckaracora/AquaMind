// Gizlilik sayfasının İspanyolca metinleri (karar 0021, İspanyolca paketi; Latin Amerika ortak İspanyolcası). Türkçe dosyayla
// (`tr-privacy.ts`) aynı biçimdedir.
//
// TASLAK: Türkçe metin gibi onaylanmadı ve hukuki incelemeden geçmedi. Haklar bölümü Türkiye'deki yasaya (KVKK) değil, kullanıcının
// tabi olduğu veri koruma yasasına atıf yapar; mağaza yayınından önce yayın yapılan ülkelere göre incelenir.
import type { PrivacyMessages } from "./tr-privacy";

export const esPrivacy: PrivacyMessages = {
  eyebrow: "Tus datos y tu privacidad",
  title: "Privacidad",
  updatedAt: "2026-10-31",
  updated: (date) => `Última actualización: ${date}`,
  draftNotice: "Borrador: este texto aún no ha sido aprobado ni revisado legalmente.",
  summaryTitle: "En resumen",
  summary: [
    "Todo lo que ingresas en AquaMind se guarda solo en el navegador de este dispositivo. No se nos envía y no hay ninguna copia en un servidor nuestro.",
    "No hay cuentas. No usamos cookies ni herramientas de publicidad, analítica o seguimiento.",
    "El sitio lo sirve un servicio de alojamiento llamado Vercel. Como en cualquier sitio web, al abrir una página tu navegador envía su dirección IP y la información del navegador a los servidores de Vercel.",
  ],
  sections: [
    {
      title: "Qué se guarda en este dispositivo",
      paragraphs: [
        "Tus acuarios, mediciones del agua, registros de mantenimiento, animales, plantas, equipos y configuración se guardan en el almacenamiento local de tu navegador (localStorage). Un acuario eliminado se guarda 30 días más en este dispositivo para que puedas restaurarlo.",
        "Los campos \"Nombre completo\" y \"Correo electrónico\" de la página de Configuración hoy no se guardan en ningún lugar.",
        "Estos datos no pasan solos a otro dispositivo ni a otro navegador. Si borras los datos del sitio en el navegador, o el navegador los borra para liberar espacio, los datos también se borran. Por eso te recomendamos hacer copias de seguridad con regularidad desde Configuración.",
      ],
    },
    {
      title: "Archivo de copia de seguridad",
      paragraphs: [
        "El botón \"Exportar datos\" descarga un archivo JSON con todos tus registros. El archivo no está cifrado: cualquiera que lo abra puede leer su contenido. Guárdalo en un lugar de confianza y no lo compartas con nadie.",
        "\"Restaurar copia de seguridad\" carga este archivo solo en el navegador de este dispositivo; el archivo no se envía a ningún lugar.",
      ],
    },
    {
      title: "El servicio que aloja el sitio",
      paragraphs: [
        "Las páginas de AquaMind las sirve Vercel Inc. (Estados Unidos). Al abrir una página, tu navegador envía su dirección IP y la información del navegador a los servidores de Vercel junto con la página que solicita. Vercel procesa esta información para operar el servicio y mantenerlo seguro.",
        "Los registros de tus acuarios no se agregan a estas solicitudes; se quedan en tu navegador.",
      ],
      link: { label: "Política de privacidad de Vercel", url: "https://vercel.com/legal/privacy-policy" },
    },
    {
      title: "Enlaces a otros sitios",
      paragraphs: [
        "Si haces clic en un enlace de fuente, tienda o guía del catálogo, ese sitio se abre en una pestaña nueva. Se aplican las reglas de privacidad de ese sitio.",
      ],
    },
    {
      title: "Eliminar tus datos",
      paragraphs: [
        "Configuración → \"Restablecer todos los datos\" elimina todos los registros de AquaMind de este dispositivo. Borrar los datos del sitio en el navegador tiene el mismo efecto. Los archivos de copia de seguridad que descargaste están en tu dispositivo; tú los eliminas.",
      ],
    },
    {
      title: "Tus derechos y cómo contactarnos",
      paragraphs: [
        "Puedes escribirnos para ejercer tus derechos según la ley de protección de datos que te corresponda o para hacer una pregunta sobre este texto.",
      ],
      pending: "Aún no se han definido el nombre y la dirección de contacto del responsable del tratamiento de datos; se agregarán aquí antes de la publicación.",
    },
    {
      title: "Si este texto cambia",
      paragraphs: [
        "Si se agregan cuentas, sincronización en la nube o funciones sociales, cambiará qué datos van a dónde. Este texto se actualizará antes de que lleguen esas funciones, y el cambio se mostrará en esta página con su fecha.",
      ],
    },
  ],
  opensNewTab: "se abre en una pestaña nueva",
  backToSettings: "Volver a Configuración",
};

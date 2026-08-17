import { escapeHtml } from "@/lib/email";
import { brandPalette } from "@/theme/palette";

/* E-posta doğrulandığı anda gönderilen hoş geldin maili. Onay maili
   (business-approved) "yayındasın" der; bu mail onay öncesi boşluğu doldurur ve
   kullanıcıya onaya gitmek için ne yapması gerektiğini söyler. */

export type WelcomeEmailLocale = "tr" | "en" | "ru" | "ar";
export type WelcomeAccountType = "supplier" | "buyer";

type WelcomeEmailArgs = {
  locale: WelcomeEmailLocale;
  accountType: WelcomeAccountType;
  displayName: string;
  dashboardUrl: string;
  exploreUrl: string;
  helpUrl: string;
  logoUrl: string;
};

type Variant = {
  subject: string;
  badge: string;
  title: string;
  lead: string;
  body: string;
  tipTitle: string;
  tip: string;
  primaryLabel: string;
  secondaryLabel: string;
};

type Copy = {
  brandTag: string;
  footerLine: string;
  footerNote: string;
  preheader: string;
  supplier: Variant;
  buyer: Variant;
};

/* Mail metinleri kasten burada tutuluyor — ui.json/content.json istemciye giden
   çeviri paketini şişirir; diğer şablonlar da kendi kendine yeter durumda. */
const COPY: Record<WelcomeEmailLocale, Copy> = {
  tr: {
    brandTag: "B2B TURİZM AĞI",
    footerLine: "Tourism Partner · Turizm profesyonelleri için güvenilir iş ağı",
    footerNote: "Bu e-posta, Tourism Partner hesabınız oluşturulduğu için otomatik olarak gönderildi.",
    preheader: "Tourism Partner hesabınız hazır.",
    supplier: {
      subject: "Kaydınız alındı",
      badge: "KAYIT TAMAMLANDI",
      title: "Hoş geldiniz",
      lead: "hesabınız oluşturuldu ve işletme profiliniz incelemeye alındı.",
      body: "Ekibimiz profilinizi kısa süre içinde inceleyecek. Onaydan sonra işletmeniz alıcılar tarafından görüntülenmeye ve size doğrudan teklif talebi gönderilmeye başlar. Profiliniz ne kadar eksiksizse inceleme o kadar hızlı sonuçlanır.",
      tipTitle: "ONAYI HIZLANDIRIN",
      tip: "İletişim bilgilerinizi kontrol edin, hizmet listenizi ve açıklamanızı tamamlayın, işletmenizi en iyi anlatan galeri görsellerini ekleyin.",
      primaryLabel: "Profili tamamla",
      secondaryLabel: "Nasıl çalışır?",
    },
    buyer: {
      subject: "Hoş geldiniz",
      badge: "KAYIT TAMAMLANDI",
      title: "Hoş geldiniz",
      lead: "hesabınız oluşturuldu.",
      body: "Artık turizmin her branşından tedarikçiye doğrudan ulaşabilir; aracısız ve komisyonsuz teklif toplayabilirsiniz. İhtiyacınızı tarif edin, uygun işletmelerden gelen teklifleri panelinizden karşılaştırın.",
      tipTitle: "İLK ADIM",
      tip: "Bölge ve hizmet türüne göre filtreleyerek çalışmak istediğiniz tedarikçileri bulun ve teklif talebi gönderin.",
      primaryLabel: "Tedarikçileri keşfet",
      secondaryLabel: "Panelim",
    },
  },
  en: {
    brandTag: "B2B TOURISM NETWORK",
    footerLine: "Tourism Partner · The trusted network for tourism professionals",
    footerNote: "This email was sent automatically because a Tourism Partner account was created for you.",
    preheader: "Your Tourism Partner account is ready.",
    supplier: {
      subject: "We received your registration",
      badge: "REGISTRATION COMPLETE",
      title: "Welcome",
      lead: "your account has been created and your business profile is under review.",
      body: "Our team will review your profile shortly. Once approved, your business becomes visible to buyers and can receive quote requests directly. The more complete your profile is, the faster the review concludes.",
      tipTitle: "SPEED UP APPROVAL",
      tip: "Check your contact details, complete your service list and description, and add gallery images that best represent your business.",
      primaryLabel: "Complete your profile",
      secondaryLabel: "How it works",
    },
    buyer: {
      subject: "Welcome",
      badge: "REGISTRATION COMPLETE",
      title: "Welcome",
      lead: "your account has been created.",
      body: "You can now reach suppliers across every branch of tourism directly, and collect quotes with no intermediaries and no commission. Describe what you need and compare incoming offers from your dashboard.",
      tipTitle: "FIRST STEP",
      tip: "Filter by region and service type to find the suppliers you want to work with, then send them a quote request.",
      primaryLabel: "Explore suppliers",
      secondaryLabel: "My dashboard",
    },
  },
  ru: {
    brandTag: "B2B ТУРИСТИЧЕСКАЯ СЕТЬ",
    footerLine: "Tourism Partner · Надёжная деловая сеть для профессионалов туризма",
    footerNote: "Это письмо отправлено автоматически, так как для вас была создана учётная запись Tourism Partner.",
    preheader: "Ваша учётная запись Tourism Partner готова.",
    supplier: {
      subject: "Мы получили вашу регистрацию",
      badge: "РЕГИСТРАЦИЯ ЗАВЕРШЕНА",
      title: "Добро пожаловать",
      lead: "ваша учётная запись создана, профиль компании находится на проверке.",
      body: "Наша команда рассмотрит профиль в ближайшее время. После одобрения ваша компания станет видимой для покупателей и сможет получать запросы на предложения напрямую. Чем полнее профиль, тем быстрее проверка.",
      tipTitle: "УСКОРЬТЕ ОДОБРЕНИЕ",
      tip: "Проверьте контактные данные, заполните список услуг и описание, добавьте фотографии, которые лучше всего представляют вашу компанию.",
      primaryLabel: "Заполнить профиль",
      secondaryLabel: "Как это работает",
    },
    buyer: {
      subject: "Добро пожаловать",
      badge: "РЕГИСТРАЦИЯ ЗАВЕРШЕНА",
      title: "Добро пожаловать",
      lead: "ваша учётная запись создана.",
      body: "Теперь вы можете напрямую связываться с поставщиками из всех сфер туризма и собирать предложения без посредников и комиссий. Опишите свою задачу и сравнивайте поступившие предложения в личном кабинете.",
      tipTitle: "ПЕРВЫЙ ШАГ",
      tip: "Используйте фильтры по региону и типу услуги, найдите нужных поставщиков и отправьте им запрос на предложение.",
      primaryLabel: "Найти поставщиков",
      secondaryLabel: "Личный кабинет",
    },
  },
  ar: {
    brandTag: "شبكة السياحة B2B",
    footerLine: "Tourism Partner · الشبكة الموثوقة لمحترفي السياحة",
    footerNote: "أُرسلت هذه الرسالة تلقائيًا لأنه تم إنشاء حساب لك على Tourism Partner.",
    preheader: "حسابك على Tourism Partner جاهز.",
    supplier: {
      subject: "تم استلام تسجيلك",
      badge: "اكتمل التسجيل",
      title: "مرحبًا بك",
      lead: "تم إنشاء حسابك، وملف شركتك قيد المراجعة.",
      body: "سيقوم فريقنا بمراجعة ملفك قريبًا. بعد الموافقة، ستصبح شركتك ظاهرة للمشترين وستتمكن من استقبال طلبات عروض الأسعار مباشرة. كلما كان ملفك أكمل، انتهت المراجعة أسرع.",
      tipTitle: "سرّع الموافقة",
      tip: "تحقق من بيانات التواصل، وأكمل قائمة خدماتك ووصفك، وأضف صورًا تعرّف بشركتك على أفضل وجه.",
      primaryLabel: "أكمل ملفك",
      secondaryLabel: "كيف تعمل المنصة",
    },
    buyer: {
      subject: "مرحبًا بك",
      badge: "اكتمل التسجيل",
      title: "مرحبًا بك",
      lead: "تم إنشاء حسابك.",
      body: "يمكنك الآن الوصول مباشرة إلى مورّدين من كل فروع السياحة، وجمع عروض الأسعار دون وسطاء ودون عمولة. صف احتياجك وقارن العروض الواردة من لوحة التحكم.",
      tipTitle: "الخطوة الأولى",
      tip: "استخدم التصفية حسب المنطقة ونوع الخدمة للعثور على المورّدين المناسبين وأرسل لهم طلب عرض سعر.",
      primaryLabel: "اكتشف المورّدين",
      secondaryLabel: "لوحة التحكم",
    },
  },
};

export function welcomeEmail({
  locale,
  accountType,
  displayName,
  dashboardUrl,
  exploreUrl,
  helpUrl,
  logoUrl,
}: WelcomeEmailArgs) {
  const copy = COPY[locale] ?? COPY.tr;
  const v = accountType === "buyer" ? copy.buyer : copy.supplier;
  const rtl = locale === "ar";
  const dir = rtl ? "rtl" : "ltr";
  const align = rtl ? "right" : "left";
  const oppositeAlign = rtl ? "left" : "right";
  // Tedarikçi profilini tamamlamaya, alıcı ise keşfetmeye yönlendirilir.
  const primaryUrl = accountType === "buyer" ? exploreUrl : dashboardUrl;
  const secondaryUrl = accountType === "buyer" ? dashboardUrl : helpUrl;

  const safeName = escapeHtml(displayName);
  const safeLogoUrl = escapeHtml(logoUrl);
  const safePrimaryUrl = escapeHtml(primaryUrl);
  const safeSecondaryUrl = escapeHtml(secondaryUrl);
  const subject = `${v.subject} — ${displayName}`;
  const fontFamily = "'Poppins',Arial,'Helvetica Neue',sans-serif";

  return {
    subject,
    html: `<!doctype html>
<html lang="${locale}" dir="${dir}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escapeHtml(subject)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      body, table, td, a, p, h1, div { font-family: ${fontFamily}; }
      @media only screen and (max-width: 600px) {
        .email-shell { padding: 20px 10px !important; }
        .email-header { padding: 0 4px 14px !important; }
        .email-hero { padding: 28px 24px !important; }
        .email-content { padding-left: 24px !important; padding-right: 24px !important; }
        .email-action-cell { display: block !important; width: 100% !important; padding: 0 0 10px !important; }
        .email-action { display: block !important; text-align: center !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:${brandPalette.ultraLightPurple};color:${brandPalette.charcoal};font-family:${fontFamily};-webkit-font-smoothing:antialiased;" dir="${dir}">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(copy.preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background-color:${brandPalette.ultraLightPurple};">
      <tr>
        <td class="email-shell" align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;margin:0 auto;">
            <tr>
              <td class="email-header" style="padding:0 6px 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${safeLogoUrl}" width="150" height="60" alt="Tourism Partner" style="display:block;width:150px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;">
                    </td>
                    <td align="${oppositeAlign}" style="color:${brandPalette.slateGray};font-family:${fontFamily};font-size:11px;font-weight:700;letter-spacing:1px;vertical-align:middle;">${escapeHtml(copy.brandTag)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="overflow:hidden;border:1px solid ${brandPalette.borderPurple};border-radius:18px;background-color:${brandPalette.white};box-shadow:0 18px 45px rgba(76,29,149,0.10);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td class="email-hero" bgcolor="${brandPalette.deepPurple}" style="background-color:${brandPalette.deepPurple};padding:34px 38px;text-align:${align};">
                      <div style="display:inline-block;margin-bottom:16px;border-radius:999px;background-color:${brandPalette.royalPurple};padding:7px 12px;color:${brandPalette.white};font-family:${fontFamily};font-size:11px;font-weight:800;letter-spacing:0.7px;">${escapeHtml(v.badge)}</div>
                      <h1 style="margin:0 0 10px;color:${brandPalette.white};font-family:${fontFamily};font-size:28px;font-weight:700;line-height:34px;letter-spacing:-0.7px;">${escapeHtml(v.title)}</h1>
                      <p style="margin:0;color:${brandPalette.softLavender};font-family:${fontFamily};font-size:15px;line-height:24px;"><strong style="color:${brandPalette.white};">${safeName}</strong> — ${escapeHtml(v.lead)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="email-content" style="padding:30px 38px 0;text-align:${align};">
                      <p style="margin:0;color:${brandPalette.charcoal};font-family:${fontFamily};font-size:15px;line-height:25px;">${escapeHtml(v.body)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="email-content" style="padding:24px 38px 0;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid ${brandPalette.borderPurple};border-radius:12px;background-color:${brandPalette.ultraLightPurple};">
                        <tr>
                          <td style="padding:18px 20px;text-align:${align};">
                            <div style="color:${brandPalette.deepPurple};font-family:${fontFamily};font-size:12px;font-weight:800;letter-spacing:0.7px;">${escapeHtml(v.tipTitle)}</div>
                            <div style="margin-top:7px;color:${brandPalette.slateGray};font-family:${fontFamily};font-size:14px;line-height:23px;">${escapeHtml(v.tip)}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="email-content" style="padding:30px 38px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="${rtl ? "margin-left:auto;margin-right:0;" : "margin-right:auto;margin-left:0;"}">
                        <tr>
                          <td class="email-action-cell" bgcolor="${brandPalette.deepPurple}" style="border-radius:11px;background-color:${brandPalette.deepPurple};">
                            <a class="email-action" href="${safePrimaryUrl}" style="display:inline-block;padding:14px 20px;background-color:${brandPalette.deepPurple};border:1px solid ${brandPalette.deepPurple};border-radius:11px;color:${brandPalette.white} !important;font-family:${fontFamily};font-size:14px;font-weight:800;text-align:center;text-decoration:none !important;">${escapeHtml(v.primaryLabel)}</a>
                          </td>
                          <td class="email-action-cell" style="padding-${rtl ? "right" : "left"}:10px;">
                            <a class="email-action" href="${safeSecondaryUrl}" style="display:inline-block;padding:13px 17px;border:1px solid ${brandPalette.borderPurple};border-radius:11px;color:${brandPalette.deepPurple} !important;font-family:${fontFamily};font-size:14px;font-weight:800;text-align:center;text-decoration:none !important;">${escapeHtml(v.secondaryLabel)}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="email-content" style="padding:18px 38px 36px;text-align:${align};">
                      <p style="margin:0;color:${brandPalette.slateGray};font-family:${fontFamily};font-size:12px;line-height:19px;">${escapeHtml(copy.footerNote)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 0;color:${brandPalette.slateGray};font-family:${fontFamily};font-size:11px;line-height:18px;">
                ${escapeHtml(copy.footerLine)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    text: `${v.title}

${displayName} — ${v.lead}

${v.body}

${v.tipTitle}
${v.tip}

${v.primaryLabel}: ${primaryUrl}
${v.secondaryLabel}: ${secondaryUrl}

Tourism Partner`,
  };
}

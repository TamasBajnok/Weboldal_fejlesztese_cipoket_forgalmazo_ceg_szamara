export const WELCOME_HTML = (nev = "") => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Üdvözöljük</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; margin:0; padding:0 }
      .container { max-width:600px; margin:28px auto; background:#ffffff; padding:24px; border-radius:8px; }
      .logo { text-align:center; margin-bottom:12px }
      .content { color:#333333; font-size:16px; line-height:1.5 }
      .btn { display:inline-block; margin-top:18px; padding:10px 16px; background:#2b6cb0; color:#fff; text-decoration:none; border-radius:6px }
      .footer { font-size:12px; color:#888888; margin-top:20px }
    </style>
  </head>
  <body>
    <div class="container">
      
      <div class="content">
        <h2>Üdvözlünk, ${nev}}</h2>
        <p>Köszönjük, hogy regisztráltál a Sneaky Shoes oldalán. Örülünk, hogy itt vagy.</p>
        <p>Mostantól hozzáférsz a fiókodhoz, leadhatsz rendeléseket és használhatod a kuponokat.</p>
        <a class="btn" href="${
          process.env.FRONTEND_URL || "/"
        }" style="display:inline-block; margin-top:18px; padding:10px 16px; background:#2b6cb0; color:#fff !important; text-decoration:none; border-radius:6px;">Weboldal megtekintése</a>
        <div class="footer">
          <p>Ha bármilyen kérdésed van, írj nekünk: <a href="mailto:support@sneaky.example">sneakshoes@sh.com</a></p>
          <p>Üdvözlettel,<br/>Sneaky Shoes</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

export const OTP_HTML = (otp, title) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; margin:0; padding:0 }
      .container { max-width:600px; margin:28px auto; background:#ffffff; padding:24px; border-radius:8px; text-align:center }
      h1 { margin:0 0 12px 0; color:#111827 }
      .code { display:inline-block; font-size:32px; letter-spacing:6px; padding:14px 20px; border-radius:8px; background:#0b74d1; color:#fff; font-weight:700 }
      .note { margin-top:14px; color:#6b7280 }
      .btn { display:inline-block; margin-top:18px; padding:10px 16px; background:#2b6cb0; color:#fff; text-decoration:none; border-radius:6px }
      .footer { font-size:12px; color:#888888; margin-top:18px }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${title}</h1>
      <p style="margin:0 0 12px 0">Használd az alábbi kódot a folyamat befejezéséhez:</p>
      <div class="code">${otp}</div>
      <p class="note">A kód 15 perc múlva lejár.</p>
      <div class="footer">Ha nem te kezdeményezted, hagyd figyelmen kívül ezt az üzenetet.</div>
    </div>
  </body>
</html>
`;
export const KUPON_HTML = (uzenet = "", kuponKod = "", lejarat = "") => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Új kupon</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; margin:0; padding:0 }
      .container { max-width:600px; margin:28px auto; background:#ffffff; padding:24px; border-radius:8px; }
      .header { text-align:center; padding-bottom:8px }
      .code { display:inline-block; margin:16px 0; padding:14px 20px; font-size:20px; letter-spacing:2px; background:#111827; color:#fff; border-radius:6px; font-weight:700 }
      .btn { display:inline-block; margin-top:18px; padding:10px 16px; background:#0b74d1; color:#fff; text-decoration:none; border-radius:6px }
      .meta { margin-top:12px; color:#6b7280; font-size:14px }
      .footer { font-size:12px; color:#888888; margin-top:20px; text-align:center }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="margin:0">Új kupon a számodra</h2>
      </div>

      <div class="content" style="color:#333333; font-size:16px; line-height:1.5">
        <p style="margin:0 0 12px 0">Kedves Vásárlónk,</p>
        <p style="margin:0 0 12px 0">${uzenet}</p>

        <div style="text-align:center">
          <div class="code">${kuponKod}</div>
        </div>

        <div class="meta">Lejárat: <strong>${lejarat}</strong></div>

        <p style="margin-top:16px">Használd a fenti kuponkódot a rendelésednél a kedvezmény érvényesítéséhez.</p>

        <p style="text-align:center; margin-top:12px">
          <a class="btn" href="${
            process.env.FRONTEND_URL || "/"
          }" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-top:18px; padding:10px 16px; background:#0b74d1; color:#fff !important; text-decoration:none; border-radius:6px; font-weight:600;">Weboldal megtekintése</a>
        </p>

        <div class="footer">
          <p>Ha kérdésed van, írj nekünk: <a href="mailto:${"sneakshoes@sh.com"}">${"sneakshoes@sh.com"}</a></p>
          <p>Üdvözlettel,<br/>Sneaky Shoes</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;
export const RENDELES_HTML = (rendelesId, nev, tetelek, osszeg, kuponKedvezmeny = 0) => {
  const szallitasiDij = 2000;
  const termekekOsszesen = osszeg - szallitasiDij;
  const tetekSor = tetelek
    .map(
      (tetel) => `
    <tr style="border-bottom:1px solid #e5e7eb">
      <td style="padding:12px; text-align:left">${tetel.nev}</td>
      <td style="padding:12px; text-align:center">${tetel.meret ? tetel.meret : "-"}</td>
      <td style="padding:12px; text-align:center">${tetel.mennyiseg} db</td>
      <td style="padding:12px; text-align:right">${(tetel.ar * tetel.mennyiseg).toLocaleString("hu-HU")} Ft</td>
    </tr>
  `
    )
    .join("");

  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Rendelés megerősítés</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; margin:0; padding:0 }
      .container { max-width:700px; margin:28px auto; background:#ffffff; padding:24px; border-radius:8px; }
      .header { border-bottom:2px solid #0b74d1; padding-bottom:16px; margin-bottom:20px }
      .header h1 { margin:0; color:#111827; font-size:24px }
      .order-id { color:#6b7280; font-size:14px; margin-top:4px }
      .section { margin-bottom:24px }
      .section-title { font-weight:700; color:#111827; margin-bottom:12px; font-size:14px }
      .info-row { display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px }
      .info-label { color:#6b7280; font-weight:600 }
      .info-value { color:#111827 }
      table { width:100%; border-collapse:collapse; margin-bottom:16px }
      th { background:#f3f4f6; padding:12px; text-align:left; font-weight:700; color:#111827; font-size:14px; border:1px solid #e5e7eb }
      td { padding:12px; font-size:14px }
      .total-row { background:#f9fafb; font-weight:700; color:#111827; border:1px solid #e5e7eb }
      .total-row td { padding:14px 12px }
      .total-cell { text-align:right }
      .footer { font-size:12px; color:#888888; margin-top:20px; border-top:1px solid #e5e7eb; padding-top:16px; text-align:center }
      .thanks { color:#0b74d1; font-weight:600 }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Rendelés megerősítés</h1>
        <div class="order-id">Rendelés szám: <strong>#${rendelesId}</strong></div>
      </div>

      <div class="section">
        <div class="section-title">Köszönjük a vásárlást, ${nev}!</div>
        <p style="color:#333333; font-size:14px; line-height:1.6; margin:0">
          A rendelésed sikeresen leadva.
          Csomag elküldéséről email értesítést fogsz kapni.
        </p>
      </div>

      <div class="section">
        <div class="section-title">Rendelés tartalma</div>
        <table>
          <thead>
            <tr>
              <th>Termék</th>
              <th style="text-align:center">Méret</th>
              <th style="text-align:center">Mennyiség</th>
              <th style="text-align:right">Érték</th>
            </tr>
          </thead>
          <tbody>
            ${tetekSor}
            <tr class="total-row">
              <td colspan="3" style="text-align:right; padding-right:12px">Termékek összesen:</td>
              <td class="total-cell">${termekekOsszesen.toLocaleString("hu-HU")} Ft</td>
            </tr>
            ${
              kuponKedvezmeny > 0
                ? `<tr class="total-row" style="background:#e8f5e9">
              <td colspan="3" style="text-align:right; padding-right:12px">Kupon kedvezmény:</td>
              <td class="total-cell" style="color:#2e7d32">-${kuponKedvezmeny.toLocaleString("hu-HU")} Ft</td>
            </tr>`
                : ""
            }
            <tr class="total-row" style="background:#0b74d1; color:white">
              <td colspan="3" style="text-align:right; padding-right:12px; color:white">Szállítási díj:</td>
              <td class="total-cell" style="color:white">${szallitasiDij.toLocaleString("hu-HU")} Ft</td>
            </tr>
            <tr class="total-row" style="background:#0b74d1; color:white; font-size:16px">
              <td colspan="3" style="text-align:right; padding-right:12px; color:white; font-size:16px">Végösszesen:</td>
              <td class="total-cell" style="color:white; font-size:16px">${osszeg.toLocaleString("hu-HU")} Ft</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p class="thanks">Köszönjük, hogy nálunk vásároltál!</p>
        <p>Ha kérdésed van, írj nekünk: <a href="mailto:sneakshoes@sh.com">sneakshoes@sh.com</a></p>
        <p>Üdvözlettel,<br/><strong>Sneaky Shoes</strong></p>
      </div>
    </div>
  </body>
</html>
  `;
};

export const UTON = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    /* Inline stílusok ajánlottak emailhez — egyszerű, ellenőrizhető CSS */
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin:0; padding:0; background:#f5f7fb; color:#111827; }
    .container { max-width:600px; margin:24px auto; background:white; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(15,23,42,0.06); }
    .header { padding:20px; background:linear-gradient(90deg,#0ea5e9,#7c3aed); color:white; }
    .content { padding:20px; }
    .btn { display:inline-block; padding:10px 16px; border-radius:8px; background:#0ea5e9; color:white; text-decoration:none; font-weight:600; }
    .meta { background:#f1f5f9; padding:12px; border-radius:6px; margin-top:12px; font-size:14px; }
    .small { font-size:13px; color:#6b7280; margin-top:14px; }
    .footer { font-size:12px; color:#9ca3af; padding:16px; text-align:center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0">Csomagod úton van</h2>
    </div>

    <div class="content">
      <p style="margin:0 0 12px 0">Szia <strong>{{name}}</strong>,</p>

      <p style="margin:0 0 12px 0">
        Örömmel értesítünk, hogy a rendelésed <strong>#{{orderId}}</strong> csomagolása befejeződött és a csomag elküldésre került.
      </p>

      <div class="meta">
        <div style="margin-bottom:8px"><strong>Szállító:</strong> {{carrier}}</div>
        <div style="margin-bottom:8px"><strong>Követési szám:</strong> {{trackingNumber}}</div>
        <div><strong>Várható kézbesítés:</strong> {{estimatedDeliveryDate}}</div>
      </div>

      <p style="margin:16px 0 8px 0">
        <a class="btn" href="{{trackingUrl}}" target="_blank" rel="noopener noreferrer">Kövesd a csomagot</a>
      </p>

      <p class="small">
        Ha a fenti gomb nem működik, másold be ezt a linket a böngésződbe:
        <br/><a href="{{trackingUrl}}" target="_blank" rel="noopener noreferrer">{{trackingUrl}}</a>
      </p>

      <p class="small">
        Kérdésed van? Vedd fel velünk a kapcsolatot: <a href="mailto:{{supportEmail}}">{{supportEmail}}</a>
      </p>

      <p style="margin-top:16px">Köszönjük, hogy nálunk vásároltál!<br/>Üdvözlettel,<br/><strong>[A céged neve]</strong></p>
    </div>

    <div class="footer">
      © {{year}} [A céged neve]. Minden jog fenntartva.
    </div>
  </div>
</body>
</html>
`;

export const SZALLITAS_KULDES_HTML = (rendelesId, nev = "Kedves Vásárlónk") => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Csomag elküldve</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; margin:0; padding:0 }
      .container { max-width:600px; margin:28px auto; background:#ffffff; padding:24px; border-radius:8px; }
      .header { background:linear-gradient(90deg, #0ea5e9, #06b6d4); color:white; padding:20px; border-radius:8px 8px 0 0; text-align:center; margin:-24px -24px 20px -24px }
      .header h1 { margin:0; font-size:24px }
      .status-badge { display:inline-block; background:#10b981; color:white; padding:8px 16px; border-radius:20px; font-weight:bold; font-size:14px; margin:12px 0 }
      .content { color:#333333; font-size:14px; line-height:1.6 }
      .order-id { background:#f3f4f6; padding:16px; border-radius:6px; margin:16px 0; border-left:4px solid #0ea5e9 }
      .order-id strong { color:#0ea5e9; font-size:16px }
      .info-row { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #e5e7eb }
      .info-row:last-child { border-bottom:none }
      .info-label { color:#6b7280; font-weight:600 }
      .info-value { color:#111827; font-weight:600 }
      .btn { display:inline-block; margin-top:16px; padding:12px 24px; background:#0ea5e9; color:white; text-decoration:none; border-radius:6px; font-weight:600 }
      .footer { font-size:12px; color:#888888; margin-top:20px; text-align:center; border-top:1px solid #e5e7eb; padding-top:16px }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Csomag elküldve!</h1>
        <div class="status-badge">✓ Úton van hozzád</div>
      </div>

      <div class="content">
        <p>Szia ${nev},</p>
        <p>Örömmel értesítünk, hogy a rendelésed csomagolása befejeződött és elküldésre került!</p>

        <div class="order-id">
          <strong>Rendelés szám:</strong><br/>
          <strong style="color:#0ea5e9; font-size:18px">#${rendelesId}</strong>
        </div>

        <p>A csomagod hamarosan megérkezik hozzád. A szállítás időtartama általában 2-5 munkanap, a helytől függően.</p>

        <p style="text-align:center">
          <a class="btn" href="${process.env.FRONTEND_URL || "/"}" target="_blank" rel="noopener noreferrer">Rendeléseim megtekintése</a>
        </p>

        <div class="footer">
          <p>Ha kérdésed van, írj nekünk: <a href="mailto:sneakshoes@sh.com">sneakshoes@sh.com</a></p>
          <p>Üdvözlettel,<br/><strong>Sneaky Shoes</strong></p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

export const SZALLITAS_FOLYAMAT_HTML = (rendelesId, nev = "Kedves Vásárlónk") => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kiszállítás alatt</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; margin:0; padding:0 }
      .container { max-width:600px; margin:28px auto; background:#ffffff; padding:24px; border-radius:8px; }
      .header { background:linear-gradient(90deg, #f59e0b, #d97706); color:white; padding:20px; border-radius:8px 8px 0 0; text-align:center; margin:-24px -24px 20px -24px }
      .header h1 { margin:0; font-size:24px }
      .status-badge { display:inline-block; background:#f59e0b; color:white; padding:8px 16px; border-radius:20px; font-weight:bold; font-size:14px; margin:12px 0 }
      .content { color:#333333; font-size:14px; line-height:1.6 }
      .order-id { background:#fef3c7; padding:16px; border-radius:6px; margin:16px 0; border-left:4px solid #f59e0b }
      .order-id strong { color:#d97706; font-size:16px }
      .timeline { margin:20px 0; position:relative }
      .timeline-item { display:flex; margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid #e5e7eb }
      .timeline-item:last-child { border-bottom:none }
      .timeline-icon { width:40px; height:40px; background:#f59e0b; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:12px; flex-shrink:0 }
      .timeline-text { flex:1 }
      .timeline-text strong { color:#111827 }
      .timeline-text p { margin:4px 0; color:#6b7280; font-size:13px }
      .btn { display:inline-block; margin-top:16px; padding:12px 24px; background:#f59e0b; color:white; text-decoration:none; border-radius:6px; font-weight:600 }
      .footer { font-size:12px; color:#888888; margin-top:20px; text-align:center; border-top:1px solid #e5e7eb; padding-top:16px }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Szállítás alatt</h1>
        <div class="status-badge">📦 Úton van</div>
      </div>

      <div class="content">
        <p>Szia ${nev},</p>
        <p>A csomagod jelenleg szállítás alatt van és a mai nap folyamán időn belül megérkezik hozzád!</p>

        <div class="order-id">
          <strong>Rendelés szám:</strong><br/>
          <strong style="color:#d97706; font-size:18px">#${rendelesId}</strong>
        </div>

        <p style="text-align:center">
          <a class="btn" href="${process.env.FRONTEND_URL || "/"}" target="_blank" rel="noopener noreferrer">Rendeléseim megtekintése</a>
        </p>

        <div class="footer">
          <p>Ha kérdésed van, írj nekünk: <a href="mailto:sneakshoes@sh.com">sneakshoes@sh.com</a></p>
          <p>Üdvözlettel,<br/><strong>Sneaky Shoes</strong></p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

export const SZALLITAS_KESZULT_HTML = (rendelesId, nev = "Kedves Vásárlónk") => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sikeresen kézbesítve</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; margin:0; padding:0 }
      .container { max-width:600px; margin:28px auto; background:#ffffff; padding:24px; border-radius:8px; }
      .header { background:linear-gradient(90deg, #10b981, #059669); color:white; padding:20px; border-radius:8px 8px 0 0; text-align:center; margin:-24px -24px 20px -24px }
      .header h1 { margin:0; font-size:24px }
      .status-badge { display:inline-block; background:#10b981; color:white; padding:8px 16px; border-radius:20px; font-weight:bold; font-size:14px; margin:12px 0 }
      .content { color:#333333; font-size:14px; line-height:1.6 }
      .order-id { background:#d1fae5; padding:16px; border-radius:6px; margin:16px 0; border-left:4px solid #10b981 }
      .order-id strong { color:#059669; font-size:16px }
      .success-message { background:#ecfdf5; padding:16px; border-radius:6px; margin:16px 0; border:1px solid #a7f3d0; color:#065f46 }
      .success-message strong { color:#059669; font-size:15px }
      .btn { display:inline-block; margin-top:16px; padding:12px 24px; background:#10b981; color:white; text-decoration:none; border-radius:6px; font-weight:600 }
      .footer { font-size:12px; color:#888888; margin-top:20px; text-align:center; border-top:1px solid #e5e7eb; padding-top:16px }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Csomag kézbesítve! 🎉</h1>
        <div class="status-badge">✓ Sikeresen megérkezett</div>
      </div>

      <div class="content">
        <p>Szia ${nev},</p>

        <div class="success-message">
          A rendelésed sikeresen kézbesítésre került. Reméljük, hogy elégedett vagy a vásárlásiddal!
        </div>

        <div class="order-id">
          <strong>Rendelés szám:</strong><br/>
          <strong style="color:#059669; font-size:18px">#${rendelesId}</strong>
        </div>

        <p>Ha bármilyen probléma merülne fel a termékekkel kapcsolatban, kérjük, vedd fel velünk a kapcsolatot!</p>


        <p style="text-align:center">
          <a class="btn" href="${process.env.FRONTEND_URL || "/"}" target="_blank" rel="noopener noreferrer">Rendeléseim megtekintése</a>
        </p>

        <div class="footer">
          <p>Problémáid megoldásához: <a href="mailto:sneakshoes@sh.com">sneakshoes@sh.com</a></p>
          <p>Köszönjük a vásárlást!<br/><strong>Sneaky Shoes</strong></p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

export const HIRLEVEL_FELIRATKOZAS_HTML = (kuponKod = "", nev = "Kedves Vásárlónk") => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Üdvözöljük a hírlevelünkre</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; margin:0; padding:0 }
      .container { max-width:600px; margin:28px auto; background:#ffffff; padding:24px; border-radius:8px; }
      .header { background:linear-gradient(90deg, #8b5cf6, #a855f7); color:white; padding:20px; border-radius:8px 8px 0 0; text-align:center; margin:-24px -24px 20px -24px }
      .header h1 { margin:0; font-size:26px; font-weight:bold }
      .content { color:#333333; font-size:15px; line-height:1.7 }
      .welcome-box { background:#ede9fe; padding:20px; border-radius:8px; margin:16px 0; border-left:4px solid #8b5cf6 }
      .welcome-box p { margin:0; color:#5b21b6 }
      .coupon-box { background:#ffffff; padding:24px; border-radius:8px; margin:20px 0; text-align:center; border:2px solid #8b5cf6; position:relative }
      .coupon-label { font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px }
      .coupon-code { font-size:32px; font-weight:bold; letter-spacing:2px; color:#8b5cf6; font-family:'Courier New', monospace; margin:12px 0 }
      .coupon-discount { font-size:14px; color:#6b7280; margin-top:8px }
      .coupon-copy-btn { display:inline-block; margin-top:12px; padding:8px 16px; background:#8b5cf6; color:white; border:none; border-radius:4px; font-size:12px; cursor:pointer; text-decoration:none }
      .benefits { margin:20px 0 }
      .benefits-title { font-weight:bold; color:#111827; margin-bottom:12px; font-size:15px }
      .benefit-item { display:flex; align-items:flex-start; margin-bottom:12px; padding:12px; background:#f9fafb; border-radius:6px }
      .benefit-icon { width:24px; height:24px; background:#8b5cf6; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:12px; flex-shrink:0; font-size:14px }
      .benefit-text { flex:1 }
      .benefit-text strong { color:#111827; display:block; margin-bottom:2px }
      .benefit-text p { color:#6b7280; font-size:13px; margin:0 }
      .cta-btn { display:inline-block; margin-top:20px; padding:14px 28px; background:#8b5cf6; color:white; text-decoration:none; border-radius:6px; font-weight:600; font-size:15px }
      .footer { font-size:12px; color:#888888; margin-top:24px; text-align:center; border-top:1px solid #e5e7eb; padding-top:16px }
      .footer a { color:#8b5cf6; text-decoration:none }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Üdvözöljük a Sneaky Shoes Hírlevelünkön! 🎉</h1>
      </div>

      <div class="content">
        <p>Szia ${nev},</p>

        <div class="welcome-box">
          <p><strong>Köszönjük, hogy feliratkoztál a hírlevelünkre!</strong> Most már részesülhetsz az új termékeinkről és speciális kedvezményekinkről.</p>
        </div>

        <p>Üdvözöljük a Sneaky Shoes család tagjaként! Mint új hírlevél-feliratkozó, szeretnénk egy meglepetéssel megajándékozni téged.</p>

        <div class="coupon-box">
          <div class="coupon-label">Az exkluzív kupon kód</div>
          <div class="coupon-code">${kuponKod}</div>
          <div class="coupon-discount"><strong>20% kedvezmény</strong> az összes vásárolt termékre</div>
        </div>

       
        <p>Most már készen állsz a vásárlásra! Navigálj a webhelyünkre és használd a fenti kupon kódot!.</p>

        <p style="text-align:center">
          <a class="cta-btn" href="${process.env.FRONTEND_URL || "/"}" target="_blank" rel="noopener noreferrer">Kezdj vásárlást most</a>
        </p>

        <p>Ha bármi kérdésed van, ne habozz felvenni velünk a kapcsolatot!</p>

        <div class="footer">
          <p style="margin-top:12px">Üdvözlettel,<br/><strong>A Sneaky Shoes csapata</strong></p>
          <p style="margin-top:16px; font-size:11px; color:#ccc">
            <a href="#" style="color:#8b5cf6; font-size:11px">Leiratkozás a hírlevelről</a> • 
            <a href="#" style="color:#8b5cf6; font-size:11px">Adatvédelmi irányelv</a>
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

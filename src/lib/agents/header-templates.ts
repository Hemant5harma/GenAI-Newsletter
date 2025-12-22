/**
 * HEADER TEMPLATES - Cross-Platform & Mobile Responsive
 * 
 * These templates are optimized for:
 * - Gmail (Web, iOS, Android)
 * - Outlook (2007-2021, Office 365, Outlook.com)
 * - Apple Mail (macOS, iOS)
 * - Yahoo Mail
 * - Samsung Mail
 * - Other major email clients
 * 
 * Key Features:
 * - Table-based layout (no flexbox/grid)
 * - Inline CSS only (no external stylesheets)
 * - MSO conditionals for Outlook
 * - Fluid width for mobile (100% with max-width)
 * - Safe fonts (Arial, Helvetica, sans-serif)
 */

export interface HeaderTemplate {
  id: string;
  name: string;
  html: string;
  description: string;
}

export const HEADER_TEMPLATES: HeaderTemplate[] = [
  {
    id: "minimal-luxe",
    name: "Minimal Luxe",
    description: "Clean white card with accent underline. Professional and responsive.",
    html: `
<!-- ====== START HEADER: Minimal Luxe ====== -->
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px;">
<tr><td>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F3F4F6" style="margin:0;padding:0;width:100%;min-width:100%;">
  <tr>
    <td align="center" style="padding:20px 16px;">
      <!--[if mso]>
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr><td>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 auto;">
        <tr>
          <td bgcolor="#FFFFFF" style="padding:24px 20px;border-radius:12px;border:1px solid #E5E7EB;">
            <!-- Top Row: Label + Date -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;font-weight:700;color:#6B7280;text-transform:uppercase;">
                  Newsletter
                </td>
                <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;">
                  {{date}}
                </td>
              </tr>
            </table>
            <!-- Spacer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="12" style="font-size:12px;line-height:12px;">&nbsp;</td></tr></table>
            <!-- Brand Name -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:32px;font-weight:800;color:{{primaryColor}};mso-line-height-rule:exactly;">
                  {{brandLogo}}
                </td>
              </tr>
            </table>
            <!-- Spacer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="10" style="font-size:10px;line-height:10px;">&nbsp;</td></tr></table>
            <!-- Accent Line -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="60" height="3" bgcolor="{{accentColor}}" style="font-size:3px;line-height:3px;border-radius:2px;">&nbsp;</td>
              </tr>
            </table>
            <!-- Spacer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="12" style="font-size:12px;line-height:12px;">&nbsp;</td></tr></table>
            <!-- Subject/Tagline -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#6B7280;">
                  {{subject}}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </td>
  </tr>
</table>
<!--[if mso]>
</td></tr></table>
<![endif]-->
<!-- ====== END HEADER: Minimal Luxe ====== -->
`
  },
  {
    id: "bold-brand",
    name: "Bold Brand",
    description: "Strong colored header with white text. High impact, mobile friendly.",
    html: `
<!-- ====== START HEADER: Bold Brand ====== -->
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px;">
<tr><td>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{{primaryColor}}" style="margin:0;padding:0;width:100%;min-width:100%;">
  <tr>
    <td align="center" style="padding:32px 20px;">
      <!--[if mso]>
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr><td align="center">
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 auto;">
        <tr>
          <td align="center">
            <!-- Brand Name -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:32px;line-height:38px;font-weight:800;color:#FFFFFF;mso-line-height-rule:exactly;">
                  {{brandLogo}}
                </td>
              </tr>
            </table>
            <!-- Spacer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="8" style="font-size:8px;line-height:8px;">&nbsp;</td></tr></table>
            <!-- Date -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;color:#FFFFFF;opacity:0.9;">
                  {{date}}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </td>
  </tr>
</table>
<!--[if mso]>
</td></tr></table>
<![endif]-->
<!-- ====== END HEADER: Bold Brand ====== -->
`
  },
  {
    id: "left-accent-rail",
    name: "Left Accent Rail",
    description: "Modern with thick accent bar on left. Works everywhere.",
    html: `
<!-- ====== START HEADER: Left Accent Rail ====== -->
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px;">
<tr><td>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F3F4F6" style="margin:0;padding:0;width:100%;min-width:100%;">
  <tr>
    <td align="center" style="padding:20px 16px;">
      <!--[if mso]>
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr><td>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 auto;border-collapse:collapse;">
        <tr>
          <!-- Left Accent Bar -->
          <td width="6" bgcolor="{{primaryColor}}" style="width:6px;background-color:{{primaryColor}};">&nbsp;</td>
          <!-- Content -->
          <td bgcolor="#FFFFFF" style="padding:24px 20px;border:1px solid #E5E7EB;border-left:none;">
            <!-- Top Row -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;font-weight:700;color:#6B7280;text-transform:uppercase;">
                  Newsletter
                </td>
                <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;">
                  {{date}}
                </td>
              </tr>
            </table>
            <!-- Spacer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="12" style="font-size:12px;line-height:12px;">&nbsp;</td></tr></table>
            <!-- Brand Name -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:30px;font-weight:800;color:{{primaryColor}};mso-line-height-rule:exactly;">
                  {{brandLogo}}
                </td>
              </tr>
            </table>
            <!-- Spacer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="10" style="font-size:10px;line-height:10px;">&nbsp;</td></tr></table>
            <!-- Subject -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#6B7280;">
                  {{subject}}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </td>
  </tr>
</table>
<!--[if mso]>
</td></tr></table>
<![endif]-->
<!-- ====== END HEADER: Left Accent Rail ====== -->
`
  },
  {
    id: "centered-editorial",
    name: "Centered Editorial",
    description: "Magazine-style centered layout. Classic and elegant.",
    html: `
<!-- ====== START HEADER: Centered Editorial ====== -->
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px;">
<tr><td>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F6F7FB" style="margin:0;padding:0;width:100%;min-width:100%;">
  <tr>
    <td align="center" style="padding:24px 16px;">
      <!--[if mso]>
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr><td>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 auto;">
        <tr>
          <td bgcolor="#FFFFFF" align="center" style="padding:28px 24px;border:1px solid #E5E7EB;border-radius:12px;">
            <!-- Label + Date -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2.5px;font-weight:700;color:#9CA3AF;text-transform:uppercase;">
                  Newsletter &bull; {{date}}
                </td>
              </tr>
            </table>
            <!-- Spacer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="14" style="font-size:14px;line-height:14px;">&nbsp;</td></tr></table>
            <!-- Brand Name -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="font-family:Georgia,'Times New Roman',Times,serif;font-size:32px;line-height:38px;font-weight:700;color:{{primaryColor}};mso-line-height-rule:exactly;">
                  {{brandLogo}}
                </td>
              </tr>
            </table>
            <!-- Spacer + Divider -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="16" style="font-size:16px;line-height:16px;">&nbsp;</td></tr></table>
            <table role="presentation" width="80" cellpadding="0" cellspacing="0" border="0" align="center">
              <tr>
                <td height="1" bgcolor="#E5E7EB" style="font-size:1px;line-height:1px;">&nbsp;</td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="16" style="font-size:16px;line-height:16px;">&nbsp;</td></tr></table>
            <!-- Subject -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#6B7280;">
                  {{subject}}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </td>
  </tr>
</table>
<!--[if mso]>
</td></tr></table>
<![endif]-->
<!-- ====== END HEADER: Centered Editorial ====== -->
`
  },
  {
    id: "dark-modern",
    name: "Dark Modern",
    description: "Dark background with accent color highlights. Premium feel.",
    html: `
<!-- ====== START HEADER: Dark Modern ====== -->
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px;">
<tr><td>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0F172A" style="margin:0;padding:0;width:100%;min-width:100%;">
  <tr>
    <td align="center" style="padding:28px 16px;">
      <!--[if mso]>
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr><td>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 auto;">
        <tr>
          <td bgcolor="#1E293B" style="padding:24px 20px;border:1px solid #334155;border-radius:12px;">
            <!-- Top Row -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;font-weight:700;color:{{accentColor}};text-transform:uppercase;">
                  Newsletter
                </td>
                <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#94A3B8;">
                  {{date}}
                </td>
              </tr>
            </table>
            <!-- Spacer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="14" style="font-size:14px;line-height:14px;">&nbsp;</td></tr></table>
            <!-- Brand Name -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:32px;font-weight:800;color:#FFFFFF;mso-line-height-rule:exactly;">
                  {{brandLogo}}
                </td>
              </tr>
            </table>
            <!-- Spacer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="12" style="font-size:12px;line-height:12px;">&nbsp;</td></tr></table>
            <!-- Accent Line -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="50" height="2" bgcolor="{{accentColor}}" style="font-size:2px;line-height:2px;">&nbsp;</td>
              </tr>
            </table>
            <!-- Spacer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="12" style="font-size:12px;line-height:12px;">&nbsp;</td></tr></table>
            <!-- Subject -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#CBD5E1;">
                  {{subject}}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </td>
  </tr>
</table>
<!--[if mso]>
</td></tr></table>
<![endif]-->
<!-- ====== END HEADER: Dark Modern ====== -->
`
  },
  {
    id: "split-tone",
    name: "Split Tone",
    description: "Two-tone split design. Brand color left, content right.",
    html: `
<!-- ====== START HEADER: Split Tone ====== -->
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px;">
<tr><td>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F3F4F6" style="margin:0;padding:0;width:100%;min-width:100%;">
  <tr>
    <td align="center" style="padding:20px 16px;">
      <!--[if mso]>
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr><td>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 auto;border-radius:12px;overflow:hidden;">
        <tr>
          <!-- Left Panel - Brand Color -->
          <td width="40%" bgcolor="{{primaryColor}}" valign="middle" style="padding:24px 16px;width:40%;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;font-weight:700;color:#FFFFFF;text-transform:uppercase;opacity:0.85;">
                  Newsletter
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="8" style="font-size:8px;line-height:8px;">&nbsp;</td></tr></table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:26px;font-weight:800;color:#FFFFFF;mso-line-height-rule:exactly;">
                  {{brandLogo}}
                </td>
              </tr>
            </table>
          </td>
          <!-- Right Panel - White -->
          <td width="60%" bgcolor="#FFFFFF" valign="middle" style="padding:24px 20px;width:60%;border:1px solid #E5E7EB;border-left:none;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;">
                  {{date}}
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="8" style="font-size:8px;line-height:8px;">&nbsp;</td></tr></table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#6B7280;">
                  {{subject}}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </td>
  </tr>
</table>
<!--[if mso]>
</td></tr></table>
<![endif]-->
<!-- ====== END HEADER: Split Tone ====== -->
`
  },
  {
    id: "simple-clean",
    name: "Simple Clean",
    description: "Minimalist single-row header. Maximum compatibility.",
    html: `
<!-- ====== START HEADER: Simple Clean ====== -->
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px;">
<tr><td>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="margin:0;padding:0;width:100%;min-width:100%;border-bottom:1px solid #E5E7EB;">
  <tr>
    <td align="center" style="padding:24px 16px;">
      <!--[if mso]>
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr><td>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 auto;">
        <tr>
          <td align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:28px;font-weight:800;color:{{primaryColor}};mso-line-height-rule:exactly;">
            {{brandLogo}}
          </td>
          <td align="right" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF;">
            {{date}}
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </td>
  </tr>
</table>
<!--[if mso]>
</td></tr></table>
<![endif]-->
<!-- ====== END HEADER: Simple Clean ====== -->
`
  },
  {
    id: "gradient-banner",
    name: "Gradient Banner",
    description: "Full-width banner with subtle gradient effect.",
    html: `
<!-- ====== START HEADER: Gradient Banner ====== -->
<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px;">
<tr><td bgcolor="{{primaryColor}}">
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{{primaryColor}}" style="margin:0;padding:0;width:100%;min-width:100%;">
  <tr>
    <td align="center" style="padding:36px 20px;background-color:{{primaryColor}};">
      <!--[if mso]>
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr><td align="center">
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 auto;">
        <tr>
          <td align="center">
            <!-- Label -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;font-weight:700;color:#FFFFFF;text-transform:uppercase;opacity:0.8;">
                  Newsletter
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="12" style="font-size:12px;line-height:12px;">&nbsp;</td></tr></table>
            <!-- Brand Name -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:36px;line-height:42px;font-weight:800;color:#FFFFFF;mso-line-height-rule:exactly;">
                  {{brandLogo}}
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="8" style="font-size:8px;line-height:8px;">&nbsp;</td></tr></table>
            <!-- Date -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#FFFFFF;opacity:0.85;">
                  {{date}}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </td>
  </tr>
</table>
<!--[if mso]>
</td></tr></table>
<![endif]-->
<!-- ====== END HEADER: Gradient Banner ====== -->
`
  }
];

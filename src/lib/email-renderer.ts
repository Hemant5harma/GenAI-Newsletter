export function renderNewsletterHtml(issue: any, blocks: any[]) {
    const brandName = issue.brand?.name || "Newsletter";
    const brandColor = "#000000"; // Default black for high fashion/modern look

    // Sort blocks
    const heroBlock = blocks.find((b: any) => b.type === "HERO");
    const productBlocks = blocks.filter((b: any) => b.type === "PRODUCT" || b.type === "ARTICLE").sort((a: any, b: any) => a.order - b.order);
    const tipBlocks = blocks.filter((b: any) => b.type === "TIP").sort((a: any, b: any) => a.order - b.order);
    const linkBlocks = blocks.filter((b: any) => b.type === "LINK").sort((a: any, b: any) => a.order - b.order);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${issue.subject}</title>
    <style>
        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        a { color: inherit; text-decoration: none; }
        .wrapper { width: 100%; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f6f6f6; }
        .main-table { margin: 0 auto; max-width: 600px; width: 100%; background-color: #ffffff; border-spacing: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff !important; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; }
    </style>
</head>
<body style="margin: 0; padding: 0;">

    <!-- Preheader -->
    <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        ${issue.preheader}
    </div>

    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f6f6">
        <tr>
            <td align="center" style="padding: 20px 0;">
                
                <!-- Main Container -->
                <table class="main-table" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width: 600px; width: 100%;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 30px 20px; border-bottom: 2px solid #eeeeee;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #000000;">${brandName}</h1>
                            ${issue.brand?.tagline ? `<p style="margin: 5px 0 0; font-size: 12px; color: #999999; text-transform: uppercase; letter-spacing: 1px;">${issue.brand.tagline}</p>` : ''}
                        </td>
                    </tr>

                    <!-- Hero Section -->
                    ${heroBlock ? `
                    <tr>
                        <td style="padding: 0;">
                            ${heroBlock.imageUrl ? `<img src="${heroBlock.imageUrl}" alt="${heroBlock.title}" width="600" style="width: 100%; max-width: 600px; height: auto; display: block;" />` : ''}
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 40px 30px; text-align: center;">
                            <h2 style="margin: 0 0 15px; font-size: 28px; font-weight: 700; color: #000000; line-height: 1.2;">${heroBlock.title}</h2>
                            <div style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 25px;">
                                ${heroBlock.content}
                            </div>
                            ${heroBlock.ctaText ? `<a href="${heroBlock.linkUrl || '#'}" class="btn" style="background: #000; color: #fff; padding: 12px 24px; text-transform: uppercase; font-weight: bold; text-decoration: none;">${heroBlock.ctaText}</a>` : ''}
                        </td>
                    </tr>
                    ` : ''}

                    <!-- Product/Article Grid (Stacked on mobile, side-by-side if simple, but for simplicity we stack them in email to ensure mobile safety) -->
                    ${productBlocks.length > 0 ? `
                    <tr>
                        <td style="padding: 30px; background-color: #fafafa; border-top: 1px solid #eeeeee;">
                            <h3 style="margin: 0 0 20px; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #dddddd; padding-bottom: 10px;">New Arrivals & Highlights</h3>
                            
                            ${productBlocks.map((block: any) => `
                            <!-- Product Item -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                                <tr>
                                    ${block.imageUrl ? `
                                    <td width="120" valign="top" style="padding-right: 20px;">
                                        <img src="${block.imageUrl}" alt="${block.title}" width="120" style="width: 120px; height: auto; border: 1px solid #eee;" />
                                    </td>
                                    ` : ''}
                                    <td valign="top">
                                        <h4 style="margin: 0 0 5px; font-size: 16px; font-weight: bold; color: #000;">${block.title}</h4>
                                        <p style="margin: 0 0 10px; font-size: 14px; color: #666; line-height: 1.4;">${block.content}</p>
                                        ${block.linkUrl ? `<a href="${block.linkUrl}" style="color: #000; text-decoration: underline; font-size: 13px; font-weight: bold;">View Details →</a>` : ''}
                                    </td>
                                </tr>
                            </table>
                            `).join('')}
                        </td>
                    </tr>
                    ` : ''}

                    <!-- Style Tips -->
                    ${tipBlocks.length > 0 ? `
                    <tr>
                        <td style="padding: 40px 30px; border-top: 1px solid #eee;">
                            <h3 style="font-size: 18px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">Style Tips</h3>
                            <ul style="margin: 0; padding-left: 20px; color: #555555;">
                                ${tipBlocks.map((block: any) => `
                                <li style="margin-bottom: 10px; font-size: 15px; line-height: 1.5;"><strong>${block.title}:</strong> ${block.content}</li>
                                `).join('')}
                            </ul>
                        </td>
                    </tr>
                    ` : ''}

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 40px 20px; background-color: #111111; color: #888888; font-size: 12px; border-top: 5px solid #000000;">
                            <p style="margin-bottom: 10px; font-color: #ffffff !important; color: #ffffff;">Loved by thousands of shoppers.</p>
                            <p style="margin-bottom: 20px;">
                                <a href="#" style="color: #ffffff; margin: 0 10px; text-decoration: none;">Instagram</a> &bull;
                                <a href="#" style="color: #ffffff; margin: 0 10px; text-decoration: none;">TikTok</a> &bull;
                                <a href="#" style="color: #ffffff; margin: 0 10px; text-decoration: none;">Facebook</a>
                            </p>
                            <p>&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
                            <p>123 Fashion Ave, NY 10001</p>
                            <p><a href="#" style="color: #666666; text-decoration: underline;">Unsubscribe</a></p>
                        </td>
                    </tr>

                </table>
                <!-- End Main Container -->

            </td>
        </tr>
    </table>

</body>
</html>
    `;
}

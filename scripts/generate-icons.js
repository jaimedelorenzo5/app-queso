const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  try {
    console.log('🧀 Generando iconos para CheeseRate PWA...');
    
    const svgPath = path.join(__dirname, '../public/icons/cheese-icon.svg');
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Generar icono 192x192
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(__dirname, '../public/icons/icon-192.png'));
    
    console.log('✅ Icono 192x192 generado');
    
    // Generar icono 512x512
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(__dirname, '../public/icons/icon-512.png'));
    
    console.log('✅ Icono 512x512 generado');
    
    console.log('🎉 Todos los iconos generados correctamente!');
  } catch (error) {
    console.error('❌ Error generando iconos:', error);
  }
}

generateIcons();

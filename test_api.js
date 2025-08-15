// Script para probar la API de ELECTA
const API_BASE = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Probando API de ELECTA...\n');

  try {
    // 1. Health Check
    console.log('1️⃣  Probando Health Check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    console.log('');

    // 2. Departamentos
    console.log('2️⃣  Probando GET Departamentos...');
    const deptResponse = await fetch(`${API_BASE}/api/departments`);
    const deptData = await deptResponse.json();
    console.log('✅ Departamentos:', deptData.length, 'departamentos encontrados');
    console.log('');

    // 3. Frontend Check
    console.log('3️⃣  Verificando Frontend...');
    try {
      const frontendResponse = await fetch('http://localhost:3000');
      console.log('✅ Frontend:', frontendResponse.status === 200 ? 'Funcionando' : 'Error');
    } catch (error) {
      console.log('❌ Frontend:', 'No disponible');
    }
    console.log('');

    console.log('🎉 ¡Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testAPI(); 
import pool from '@db/db.js';

export async function seedComponentVisibility(): Promise<void> {
  try {
    console.log('🌱 Iniciando seeding de component_visibility...');

    // Insertar fases electorales
    const phases = [
      { name: 'before', display_name: 'Antes de las Elecciones' },
      { name: 'during', display_name: 'Durante las Elecciones' },
      { name: 'after', display_name: 'Después de las Elecciones' },
      { name: 'results', display_name: 'Resultados Finales' }
    ];

    console.log(`📋 Procesando ${phases.length} fases...`);

    for (const phase of phases) {
      console.log(`🔄 Procesando fase: ${phase.name}`);
      
      // Insertar o obtener la fase existente
      let result = await pool.query(
        'INSERT INTO component_visibility (phase_name, phase_display_name, is_active) VALUES ($1, $2, $3) ON CONFLICT (phase_name) DO NOTHING RETURNING id',
        [phase.name, phase.display_name, phase.name === 'before']
      );
      
      let phaseId: number;
      
      if (result.rows.length === 0) {
        // La fase ya existe, obtener su ID
        console.log(`🔍 Fase '${phase.name}' ya existe, obteniendo ID...`);
        const existingPhase = await pool.query(
          'SELECT id FROM component_visibility WHERE phase_name = $1',
          [phase.name]
        );
        phaseId = existingPhase.rows[0].id;
        console.log(`✅ Fase '${phase.name}' ya existe con ID: ${phaseId}`);
      } else {
        phaseId = result.rows[0].id;
        console.log(`✅ Fase '${phase.name}' creada con ID: ${phaseId}`);
      }
      
      // Insertar componentes para esta fase
      const components = [
        { name: 'Header', display_name: 'Barra de navegación principal', visible: true, order: 1 },
        { name: 'GlobalCounter', display_name: 'Contador global de votos', visible: true, order: 2 },
        { name: 'Map', display_name: 'Mapa interactivo de resultados', visible: true, order: 3 },
        { name: 'StatsContainer', display_name: 'Estadísticas y gráficos', visible: true, order: 4 },
        { name: 'IncidentsFlag', display_name: 'Bandera de incidentes', visible: true, order: 5 },
        { name: 'Footer', display_name: 'Pie de página', visible: true, order: 6 },
        { name: 'ElectionReportTable', display_name: 'Tabla de reportes', visible: true, order: 7 },
        { name: 'SecondRoundBanner', display_name: 'Banner de segunda vuelta', visible: false, order: 8 },
        { name: 'WinnerBanner', display_name: 'Banner del ganador', visible: false, order: 9 }
      ];

      console.log(`📦 Insertando ${components.length} componentes para fase '${phase.name}'...`);

      for (const component of components) {
        try {
          await pool.query(
            'INSERT INTO phase_components (phase_id, component_name, component_display_name, is_visible, sort_order) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (phase_id, component_name) DO NOTHING',
            [phaseId, component.name, component.display_name, component.visible, component.order]
          );
          console.log(`  ✅ Componente '${component.name}' insertado/verificado`);
        } catch (error) {
          console.error(`  ❌ Error insertando componente '${component.name}':`, error);
        }
      }
      
      console.log(`✅ Componentes insertados para fase '${phase.name}'`);
    }

    // Verificar que se insertaron los datos
    const phaseCount = await pool.query('SELECT COUNT(*) FROM component_visibility');
    const componentCount = await pool.query('SELECT COUNT(*) FROM phase_components');
    
    console.log(`📊 Verificación final:`);
    console.log(`  - Fases creadas: ${phaseCount.rows[0].count}`);
    console.log(`  - Componentes creados: ${componentCount.rows[0].count}`);

    console.log('✅ Seeding de component_visibility completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el seeding de component_visibility:', error);
    throw error;
  }
}

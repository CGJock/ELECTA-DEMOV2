const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ComponentVisibility {
  id: string;
  component_name: string;
  is_visible: boolean;
  phase_name: string;
  created_at: string;
  updated_at: string;
}

export interface PhaseComponents {
  phase_name: string;
  components: ComponentVisibility[];
}

export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  created_at: string;
  updated_at: string;
}

class ComponentVisibilityService {

  // Obtener todas las fases disponibles
  async getPhases(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/component-visibility/phases`, {
        method: 'GET',
        credentials: 'include', // Enviar cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching phases:', error);
      throw error;
    }
  }

  // Obtener la fase activa actual
  async getActivePhase(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/component-visibility/active-phase`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.phase_name;
    } catch (error) {
      console.error('Error fetching active phase:', error);
      throw error;
    }
  }

  // Activar una fase específica
  async activatePhase(phaseName: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/component-visibility/activate-phase`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase_name: phaseName })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('Error activating phase:', error);
      throw error;
    }
  }

  // Obtener componentes visibles para una fase específica
  async getPhaseComponents(phaseName: string): Promise<ComponentVisibility[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/component-visibility/phase-components/${phaseName}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching phase components:', error);
      throw error;
    }
  }

  // Actualizar visibilidad de un componente
  async updateComponentVisibility(
    componentName: string, 
    phaseName: string, 
    isVisible: boolean
  ): Promise<ComponentVisibility> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/component-visibility/update-component`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ component_name: componentName, phase_name: phaseName, is_visible: isVisible })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error updating component visibility:', error);
      throw error;
    }
  }

  // Aplicar cambios de visibilidad
  async applyChanges(phaseName: string, components: ComponentVisibility[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/component-visibility/apply-changes`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase_name: phaseName, components })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('Error applying changes:', error);
      throw error;
    }
  }

  // Obtener configuración del sitio
  async getSiteConfig(): Promise<SiteConfig[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/component-visibility/site-config`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching site config:', error);
      throw error;
    }
  }
}

export const componentVisibilityService = new ComponentVisibilityService();
export default componentVisibilityService;
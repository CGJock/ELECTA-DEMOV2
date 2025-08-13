// "use client";

// import { useState, useEffect } from 'react';

// interface Election {
//   id: number;
//   name: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   totalVoters: number;
//   status: 'active' | 'upcoming' | 'inactive';
//   votes: number;
// }

// interface ElectionFormData {
//   name: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   totalVoters: number;
// }

// interface ValidationErrors {
//   name?: string;
//   description?: string;
//   startDate?: string;
//   endDate?: string;
//   totalVoters?: string;
// }

// export const useElectionManager = () => {
//   const [elections, setElections] = useState<Election[]>([]);
//   const [editingElection, setEditingElection] = useState<Election | null>(null);
//   const [showElectionForm, setShowElectionForm] = useState(false);
//   const [errors, setErrors] = useState<ValidationErrors>({});

//   // Cargar elecciones guardadas
//   useEffect(() => {
//     const savedElections = localStorage.getItem('electa-elections');
//     if (savedElections) {
//       try {
//         const parsed = JSON.parse(savedElections);
//         setElections(parsed);
//       } catch (error) {
//         console.warn('Error al cargar elecciones guardadas:', error);
//         // Cargar datos de ejemplo si no hay datos guardados
//         loadDefaultElections();
//       }
//     } else {
//       loadDefaultElections();
//     }
//   }, []);

//   // Cargar elecciones por defecto
//   const loadDefaultElections = () => {
//     const defaultElections: Election[] = [
//       {
//         id: 1,
//         name: 'Elección Presidencial 2024',
//         description: 'Elección para presidente de la república',
//         startDate: '2024-01-15',
//         endDate: '2024-01-20',
//         totalVoters: 50000,
//         status: 'active',
//         votes: 32000
//       },
//       {
//         id: 2,
//         name: 'Elección Municipal',
//         description: 'Elección para alcalde municipal',
//         startDate: '2024-02-01',
//         endDate: '2024-02-05',
//         totalVoters: 15000,
//         status: 'upcoming',
//         votes: 0
//       }
//     ];
//     setElections(defaultElections);
//     saveElectionsToStorage(defaultElections);
//   };

//   // Guardar elecciones en localStorage
//   const saveElectionsToStorage = (electionsToSave: Election[]) => {
//     localStorage.setItem('electa-elections', JSON.stringify(electionsToSave));
//   };

//   // Validar formulario de elección
//   const validateElectionForm = (formData: ElectionFormData): boolean => {
//     const newErrors: ValidationErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'El nombre de la elección es requerido';
//     } else if (formData.name.length < 5) {
//       newErrors.name = 'El nombre debe tener al menos 5 caracteres';
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'La descripción es requerida';
//     } else if (formData.description.length < 10) {
//       newErrors.description = 'La descripción debe tener al menos 10 caracteres';
//     }

//     if (!formData.startDate) {
//       newErrors.startDate = 'La fecha de inicio es requerida';
//     }

//     if (!formData.endDate) {
//       newErrors.endDate = 'La fecha de fin es requerida';
//     }

//     if (formData.startDate && formData.endDate) {
//       const startDate = new Date(formData.startDate);
//       const endDate = new Date(formData.endDate);
      
//       if (startDate >= endDate) {
//         newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
//       }
//     }

//     if (formData.totalVoters <= 0) {
//       newErrors.totalVoters = 'El total de votantes debe ser mayor a 0';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Crear nueva elección
//   const createElection = (electionData: ElectionFormData) => {
//     if (!validateElectionForm(electionData)) {
//       return false;
//     }

//     const newElection: Election = {
//       ...electionData,
//       id: Math.max(...elections.map(e => e.id), 0) + 1,
//       votes: 0,
//       status: 'upcoming'
//     };

//     const updatedElections = [...elections, newElection];
//     setElections(updatedElections);
//     saveElectionsToStorage(updatedElections);
//     setShowElectionForm(false);
//     setErrors({});
//     return true;
//   };

//   // Actualizar elección existente
//   const updateElection = (id: number, electionData: Partial<ElectionFormData>) => {
//     if (!validateElectionForm({ ...editingElection!, ...electionData } as ElectionFormData)) {
//       return false;
//     }

//     const updatedElections = elections.map(election =>
//       election.id === id ? { ...election, ...electionData } : election
//     );
    
//     setElections(updatedElections);
//     saveElectionsToStorage(updatedElections);
//     setEditingElection(null);
//     setShowElectionForm(false);
//     setErrors({});
//     return true;
//   };

//   // Eliminar elección
//   const deleteElection = (id: number) => {
//     const updatedElections = elections.filter(election => election.id !== id);
//     setElections(updatedElections);
//     saveElectionsToStorage(updatedElections);
//   };

//   // Activar elección
//   const activateElection = (id: number) => {
//     const updatedElections = elections.map(election => ({
//       ...election,
//       status: election.id === id ? 'active' : 'inactive'
//     }));
//     setElections(updatedElections);
//     saveElectionsToStorage(updatedElections);
//   };

//   // Desactivar elección
//   const deactivateElection = (id: number) => {
//     const updatedElections = elections.map(election =>
//       election.id === id ? { ...election, status: 'inactive' } : election
//     );
//     setElections(updatedElections);
//     saveElectionsToStorage(updatedElections);
//   };

//   // Abrir formulario de edición
//   const openEditForm = (election: Election) => {
//     setEditingElection(election);
//     setShowElectionForm(true);
//     setErrors({});
//   };

//   // Cerrar formulario
//   const closeForm = () => {
//     setEditingElection(null);
//     setShowElectionForm(false);
//     setErrors({});
//   };

//   // Limpiar errores de un campo específico
//   const clearFieldError = (field: keyof ValidationErrors) => {
//     setErrors(prev => ({ ...prev, [field]: undefined }));
//   };

//   return {
//     elections,
//     editingElection,
//     showElectionForm,
//     errors,
//     createElection,
//     updateElection,
//     deleteElection,
//     activateElection,
//     deactivateElection,
//     openEditForm,
//     closeForm,
//     setShowElectionForm,
//     clearFieldError
//   };
// };

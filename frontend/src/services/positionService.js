import axios from 'axios';

// Obtener la información del flujo de entrevista de una posición
export const getInterviewFlow = async (positionId) => {
  try {
    const response = await axios.get(`http://localhost:3010/position/${positionId}/interviewFlow`);
    return response.data;
  } catch (error) {
    console.error('Error fetching interview flow:', error);
    throw error;
  }
};

// Obtener los candidatos de una posición
export const getCandidates = async (positionId) => {
  try {
    const response = await axios.get(`http://localhost:3010/position/${positionId}/candidates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

// Actualizar la etapa de un candidato
export const updateCandidateStage = async (candidateId, applicationId, currentInterviewStep) => {
  try {
    const response = await axios.put(`http://localhost:3010/candidates/${candidateId}`, {
      applicationId,
      currentInterviewStep
    });
    return response.data;
  } catch (error) {
    console.error('Error updating candidate stage:', error);
    throw error;
  }
}; 
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useParams, Link } from 'react-router-dom';
import { getInterviewFlow, getCandidates, updateCandidateStage } from '../services/positionService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Position.css';

interface CandidateType {
  id: number;
  fullName: string;
  currentInterviewStep: string | number;
  averageScore: number;
  applicationId: number;
}

interface InterviewStep {
  id: number;
  name: string;
  orderIndex: number;
}

const Position: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [positionName, setPositionName] = useState<string>('');
  const [interviewSteps, setInterviewSteps] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<CandidateType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const interviewFlowData = await getInterviewFlow(id);
        const candidatesData = await getCandidates(id);
        
        setPositionName(interviewFlowData.positionName);
        setInterviewSteps(interviewFlowData.interviewFlow.interviewSteps);
        setCandidates(candidatesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor, inténtelo de nuevo.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filtrar candidatos por etapa
  const getCandidatesByStep = (stepId: number) => {
    return candidates.filter(candidate => {
      const candidateStepId = typeof candidate.currentInterviewStep === 'string' 
        ? interviewSteps.find(step => step.name === candidate.currentInterviewStep)?.id 
        : candidate.currentInterviewStep;
      
      return candidateStepId === stepId;
    });
  };

  // Manejar el inicio del arrastre
  const handleDragStart = (e: React.DragEvent, candidate: CandidateType) => {
    e.dataTransfer.setData('candidateId', candidate.id.toString());
    e.dataTransfer.setData('applicationId', candidate.applicationId.toString());
  };

  // Permitir soltar
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Manejar el evento de soltar
  const handleDrop = (e: React.DragEvent, targetStepId: number) => {
    e.preventDefault();
    const candidateId = parseInt(e.dataTransfer.getData('candidateId'));
    const applicationId = parseInt(e.dataTransfer.getData('applicationId'));
    
    // Obtener el nombre de la etapa destino para mostrar en la notificación
    const targetStepName = interviewSteps.find(step => step.id === targetStepId)?.name || 'nueva etapa';
    
    // Obtener el nombre del candidato
    const candidate = candidates.find(c => c.id === candidateId);
    
    if (candidate) {
      // Verificar si el candidato ya está en esa etapa
      const candidateStepId = typeof candidate.currentInterviewStep === 'string'
        ? interviewSteps.find(step => step.name === candidate.currentInterviewStep)?.id
        : candidate.currentInterviewStep;
        
      if (candidateStepId === targetStepId) {
        toast.info(`${candidate.fullName} ya está en la etapa "${targetStepName}"`);
        return;
      }
      
      handleCandidateDrop(candidateId, applicationId, targetStepId, candidate.fullName, targetStepName)
        .catch(err => {
          console.error('Error moving candidate:', err);
          toast.error(`Error al mover a ${candidate.fullName}`);
        });
    }
  };

  // Actualizar el estado del candidato cuando se suelta
  const handleCandidateDrop = async (
    candidateId: number, 
    applicationId: number, 
    targetStepId: number, 
    candidateName: string, 
    targetStepName: string
  ) => {
    // Actualización optimista de la UI
    const updatedCandidates = candidates.map(candidate => 
      candidate.id === candidateId
        ? { ...candidate, currentInterviewStep: targetStepId }
        : candidate
    );
    
    setCandidates(updatedCandidates);
    toast.info(`Moviendo a ${candidateName} a "${targetStepName}"...`);

    try {
      // Llamada a la API para actualizar en el servidor
      await updateCandidateStage(candidateId, applicationId, targetStepId);
      toast.success(`${candidateName} movido a "${targetStepName}" correctamente`);
    } catch (error) {
      console.error('Error moving candidate:', error);
      // Revertir cambios en caso de error
      setCandidates(candidates); // Restaura el estado anterior
      toast.error(`Error al mover a ${candidateName}. Por favor, inténtelo de nuevo.`);
    }
  };

  // Renderizar puntuación como puntos
  const renderScoreDots = (score: number) => {
    const dots = [];
    const maxScore = 5; // Máximo de puntuación
    
    for (let i = 0; i < Math.min(score, maxScore); i++) {
      dots.push(<span key={i} className="score-dot filled"></span>);
    }
    
    for (let i = dots.length; i < maxScore; i++) {
      dots.push(<span key={i} className="score-dot"></span>);
    }
    
    return <div className="score-dots">{dots}</div>;
  };

  if (loading) return <div className="text-center p-5">Cargando...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <Container fluid className="position-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <Row className="header mb-4">
        <Col>
          <Link to="/positions" className="btn btn-link text-decoration-none">
            <ArrowLeft size={25} /> Volver a posiciones
          </Link>
          <h2>{positionName}</h2>
        </Col>
      </Row>

      <div className="kanban-board">
        {interviewSteps.map((step) => (
          <div 
            key={step.id} 
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, step.id)}
          >
            <div className="column-header">
              <h4>{step.name}</h4>
              <span className="candidate-count">{getCandidatesByStep(step.id).length}</span>
            </div>
            <div className="column-body">
              {getCandidatesByStep(step.id).map((candidate) => (
                <Card 
                  key={candidate.id} 
                  className="candidate-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, candidate)}
                >
                  <Card.Body>
                    <Card.Title>{candidate.fullName}</Card.Title>
                    {renderScoreDots(candidate.averageScore)}
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Position; 
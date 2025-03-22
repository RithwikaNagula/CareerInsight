import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Grid,
  Card,
  CardContent,
  Alert,
  styled,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius * 2,
  background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const steps = ['Job Details', 'Interview Questions', 'Interview Rounds'];

const ShareExperience = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.experience;

  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    salary: '',
    yearOfJoining: '',
    description: '',
    questions: {
      technical: [''],
      nonTechnical: ['']
    },
    rounds: [
      {
        roundNumber: 1,
        description: '',
        keyPoints: ['']
      }
    ]
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, type, value) => {
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        [type]: prev.questions[type].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const handleAddQuestion = (type) => {
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        [type]: [...prev.questions[type], '']
      }
    }));
  };

  const handleRemoveQuestion = (index, type) => {
    if (formData.questions[type].length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: {
          ...prev.questions,
          [type]: prev.questions[type].filter((_, i) => i !== index)
        }
      }));
    }
  };

  const handleRoundChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.map((round, i) => {
        if (i === index) {
          return { ...round, [field]: value };
        }
        return round;
      })
    }));
  };

  const handleKeyPointChange = (roundIndex, pointIndex, value) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.map((round, i) => {
        if (i === roundIndex) {
          const newKeyPoints = [...round.keyPoints];
          newKeyPoints[pointIndex] = value;
          return { ...round, keyPoints: newKeyPoints };
        }
        return round;
      })
    }));
  };

  const handleAddRound = () => {
    setFormData(prev => ({
      ...prev,
      rounds: [
        ...prev.rounds,
        {
          roundNumber: prev.rounds.length + 1,
          description: '',
          keyPoints: ['']
        }
      ]
    }));
  };

  const handleAddKeyPoint = (roundIndex) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.map((round, i) => {
        if (i === roundIndex) {
          return {
            ...round,
            keyPoints: [...round.keyPoints, '']
          };
        }
        return round;
      })
    }));
  };

  const handleRemoveKeyPoint = (roundIndex, pointIndex) => {
    if (formData.rounds[roundIndex].keyPoints.length > 1) {
      setFormData(prev => ({
        ...prev,
        rounds: prev.rounds.map((round, i) => {
          if (i === roundIndex) {
            return {
              ...round,
              keyPoints: round.keyPoints.filter((_, pIndex) => pIndex !== pointIndex)
            };
          }
          return round;
        })
      }));
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = editData ? 'put' : 'post';
      const url = editData 
        ? `http://localhost:5000/api/experiences/${editData._id}`
        : 'http://localhost:5000/api/experiences';

      const response = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 || response.status === 201) {
        navigate('/experiences');
      }
    } catch (error) {
      console.error('Error submitting experience:', error);
      setError(error.response?.data?.message || 'Error submitting experience');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormSection>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salary (per year)"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Year of Joining"
                  name="yearOfJoining"
                  type="number"
                  value={formData.yearOfJoining}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>
          </FormSection>
        );

      case 1:
        return (
          <FormSection>
            <Typography variant="h6" gutterBottom>
              Technical Questions
            </Typography>
            {formData.questions.technical.map((question, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      label={`Technical Question ${index + 1}`}
                      value={question}
                      onChange={(e) => handleQuestionChange(index, 'technical', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton 
                      onClick={() => handleRemoveQuestion(index, 'technical')}
                      color="error"
                      disabled={formData.questions.technical.length === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddQuestion('technical')}
              sx={{ mt: 1 }}
            >
              Add Technical Question
            </Button>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Non-Technical Questions
            </Typography>
            {formData.questions.nonTechnical.map((question, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      label={`Non-Technical Question ${index + 1}`}
                      value={question}
                      onChange={(e) => handleQuestionChange(index, 'nonTechnical', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton 
                      onClick={() => handleRemoveQuestion(index, 'nonTechnical')}
                      color="error"
                      disabled={formData.questions.nonTechnical.length === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddQuestion('nonTechnical')}
              sx={{ mt: 1 }}
            >
              Add Non-Technical Question
            </Button>
          </FormSection>
        );

      case 2:
        return (
          <FormSection>
            {formData.rounds.map((round, roundIndex) => (
              <Card key={roundIndex} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Round {round.roundNumber}
                  </Typography>
                  <TextField
                    fullWidth
                    label="Round Description"
                    value={round.description}
                    onChange={(e) => handleRoundChange(roundIndex, 'description', e.target.value)}
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="subtitle1" gutterBottom>
                    Key Points
                  </Typography>
                  {round.keyPoints.map((point, pointIndex) => (
                    <Box key={pointIndex} sx={{ mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={11}>
                          <TextField
                            fullWidth
                            label={`Key Point ${pointIndex + 1}`}
                            value={point}
                            onChange={(e) => handleKeyPointChange(roundIndex, pointIndex, e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            onClick={() => handleRemoveKeyPoint(roundIndex, pointIndex)}
                            color="error"
                            disabled={round.keyPoints.length === 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddKeyPoint(roundIndex)}
                  >
                    Add Key Point
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddRound}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Add Another Round
            </Button>
          </FormSection>
        );

      default:
        return null;
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <StyledPaper>
        <Typography variant="h4" gutterBottom align="center">
          {editData ? 'Edit Experience' : 'Share Your Experience'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                {editData ? 'Update' : 'Submit'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default ShareExperience; 
import React, { useEffect } from 'react';

// Preload wizard components in the background
const WizardPreloader: React.FC = () => {
  useEffect(() => {
    // Preload wizard components when the component mounts
    const preloadComponents = async () => {
      try {
        // Preload wizard steps
        const [
          UserInputForm,
          Step1Experience,
          Step2Route,
          Step3Crew,
          Step4Preferences,
          Step5BoatDetails,
          Step6Review,
          RecommendationCard,
          RecommendationLoadingScreen
        ] = await Promise.all([
          import('./UserInputForm'),
          import('./wizard/Step1_Experience'),
          import('./wizard/Step2_Route'),
          import('./wizard/Step3_Crew'),
          import('./wizard/Step4_Preferences'),
          import('./wizard/Step5_BoatDetails'),
          import('./wizard/Step6_Review'),
          import('./RecommendationCard'),
          import('./RecommendationLoadingScreen')
        ]);

        // Store in memory for faster access
        (window as any).__WIZARD_COMPONENTS__ = {
          UserInputForm: UserInputForm.default,
          Step1Experience: Step1Experience.default,
          Step2Route: Step2Route.default,
          Step3Crew: Step3Crew.default,
          Step4Preferences: Step4Preferences.default,
          Step5BoatDetails: Step5BoatDetails.default,
          Step6Review: Step6Review.default,
          RecommendationCard: RecommendationCard.default,
          RecommendationLoadingScreen: RecommendationLoadingScreen.default
        };

        console.log('Wizard components preloaded successfully');
      } catch (error) {
        console.warn('Failed to preload wizard components:', error);
      }
    };

    // Start preloading after a short delay to not block initial render
    const timer = setTimeout(preloadComponents, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything
  return null;
};

export default WizardPreloader; 
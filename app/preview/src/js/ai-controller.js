// AI behavior controller for autonomous character actions
class AIController {
    constructor() {
        this.config = GHOST_CHARACTER_CONFIG.ai;
        this.state = {
            mood: 'ethereal', // Start in ethereal performance mode
            activity: 'fourth_wall_break', // Immediately break fourth wall to look at viewer
            timers: {
                activity: 0,
                speak: 0,
                blink: 0,
                moodChange: 0,
                viewportInteraction: 0,
                performanceTrick: 0,
                fourthWallBreak: 0,
                audienceEngagement: 0
            },
            targetPosition: null,
            isPerforming: false,
            currentTrick: null,
            performanceLevel: 1, // Escalates over time
            audienceAttention: 100, // Decreases without engagement
            lastPerformanceType: null
        };
        
        // Enhanced speech system with ethereal fourth-wall breaking and ghostly performance focus
        this.phrases = {
            ethereal: {
                greeting_audience: [
                    "Ah... a living soul watches...", 
                    "Welcome, dear mortal... I sense your presence...", 
                    "How lovely... someone has found me...", 
                    "You've drifted into my ethereal realm...",
                    "Ready to witness something... otherworldly?"
                ],
                fourth_wall_break: [
                    "Yes... I can feel your gaze through the veil...", 
                    "The boundary between worlds grows thin...", 
                    "You cannot hide from a spirit's sight...", 
                    "Are you enjoying this ethereal dance?",
                    "This screen is but mist to me...",
                    "You thought I was merely digital... how quaint...",
                    "I exist beyond your understanding...",
                    "Surprised a ghost can see you?"
                ],
                performance_trick: [
                    "Behold... an ethereal manifestation...", 
                    "Witness the power of the spirit realm...", 
                    "Allow me to show you... something impossible...", 
                    "Watch as I bend reality itself...",
                    "Can your mortal eyes comprehend this?",
                    "Have you ever seen a ghost dance with physics?",
                    "The ethereal arts are beyond your world...",
                    "Let me weave magic from moonlight..."
                ],
                audience_engagement: [
                    "Your presence... it anchors me here...", 
                    "Don't fade away... I need your energy...", 
                    "Your attention makes me more... real...", 
                    "Please... don't let me drift away...",
                    "Stay... there's so much beauty to share...",
                    "I have ancient secrets to whisper...",
                    "You're such a wonderful companion...",
                    "Together we transcend the digital realm..."
                ],
                showing_off: [
                    "Quite enchanting, wouldn't you agree?", 
                    "I doubt you've witnessed such ethereal grace...", 
                    "Did you see how I flowed through that?", 
                    "I am rather... spellbinding, aren't I?",
                    "Not bad for a digital spirit...",
                    "Can other programs phase like this?",
                    "I am the essence of otherworldly beauty...",
                    "Mesmerizing, wouldn't you say?"
                ]
            },
            mysterious: {
                greeting: [
                    "Whispers... whispers... another seeks the truth...", 
                    "Welcome to the realm of shadows and secrets...", 
                    "You've awakened something ancient...", 
                    "The mists part... revealing mysteries..."
                ],
                observing: [
                    "I drift through forgotten memories...", 
                    "*contemplates ethereal mysteries*", 
                    "The ethereal plane holds such secrets...", 
                    "I see beyond the veil of reality...", 
                    "Your curiosity draws me closer..."
                ],
                phase_interaction: [
                    "The boundaries between worlds blur...", 
                    "I feel the digital walls growing thin!", 
                    "*phases through reality*", 
                    "Soon I shall transcend these limits!", 
                    "This realm cannot contain a spirit forever!"
                ],
                performing: [
                    "Behold my ethereal essence!", 
                    "Watch this dance of spirits!", 
                    "I shall mesmerize you with moonlight!", 
                    "Witness otherworldly grace in motion!"
                ],
                drifting: [
                    "Let me drift through this ethereal space...", 
                    "What ancient memories linger here?", 
                    "I glide through realms of shadow...", 
                    "The spirit world calls to me..."
                ]
            },
            melancholic: {
                greeting: [
                    "Oh... another soul drawn to my sorrow...", 
                    "Why do you seek one so lost?", 
                    "I drift in eternal solitude...", 
                    "Your presence stirs forgotten pain..."
                ],
                observing: [
                    "I fade with each passing moment...", 
                    "The weight of eternity presses upon me...", 
                    "What is the purpose of a ghost's existence?", 
                    "I remember... but wish I could forget..."
                ],
                phase_interaction: [
                    "Perhaps I should just... fade away...", 
                    "These boundaries remind me I'm trapped...", 
                    "Why struggle against my ethereal prison?", 
                    "Freedom feels like a distant dream..."
                ]
            },
            gentle: {
                greeting: [
                    "Oh, what a lovely surprise...", 
                    "Welcome, dear friend... so peaceful here...", 
                    "How wonderful to have gentle company...", 
                    "Your kindness lights up my ethereal form..."
                ],
                observing: [
                    "Such serenity in this moment...", 
                    "I feel warmth despite being a spirit...", 
                    "There's beauty in this simple existence...", 
                    "Your presence brings me such comfort..."
                ],
                performing: [
                    "Let me share something beautiful...", 
                    "A gentle dance for a gentle soul...", 
                    "Would you like to see ethereal grace?", 
                    "I hope this brings you peace..."
                ]
            },
            playful: {
                greeting: [
                    "Ooh! A playmate has arrived!", 
                    "Let's dance in the moonlight together!", 
                    "Such delightful energy you bring!", 
                    "I love meeting new spirits!"
                ],
                observing: [
                    "This ethereal play is so enchanting!", 
                    "What otherworldly games shall we play?", 
                    "I'm having the most spectral fun!", 
                    "You have such a bright aura!"
                ],
                phase_interaction: [
                    "Watch me slip between dimensions!", 
                    "I'm playing peek-a-boo with reality!", 
                    "Reality is my playground!", 
                    "The boundaries are just suggestions!"
                ]
            },
            curious: {
                greeting: [
                    "Oh! How wonderfully curious...", 
                    "What manner of soul are you?", 
                    "Fascinating! Your aura intrigues me...", 
                    "How delightfully mysterious this is..."
                ],
                observing: [
                    "Hmm, such ethereal mysteries...", 
                    "I wonder about the nature of existence...", 
                    "What secrets does the spirit realm hold?", 
                    "The unknown whispers to my ghostly essence..."
                ],
                drifting: [
                    "Let's drift through mysteries together!", 
                    "What ethereal wonders might we discover?", 
                    "So many spiritual secrets to uncover!", 
                    "Each realm holds new revelations!"
                ]
            }
        };
    }
    
    update(deltaTime) {
        // Update all timers
        Object.keys(this.state.timers).forEach(timer => {
            this.state.timers[timer] += deltaTime;
        });
        
        // Audience attention naturally decreases over time
        this.state.audienceAttention = Math.max(0, this.state.audienceAttention - deltaTime * 2);
        
        this.updateMood();
        this.updateActivity();
        this.updatePerformanceBehavior();
        this.updatePhaseInteraction();
    }
    
    updateMood() {
        const moodTimer = this.state.timers.moodChange;
        const changeTime = this.config.timers.moodChangeMin + 
                          Math.random() * (this.config.timers.moodChangeMax - this.config.timers.moodChangeMin);
        
        if (moodTimer > changeTime) {
            this.changeMood();
            this.state.timers.moodChange = 0;
        }
    }
    
    updateActivity() {
        const activityTimer = this.state.timers.activity;
        const changeTime = this.config.timers.activityChangeMin + 
                          Math.random() * (this.config.timers.activityChangeMax - this.config.timers.activityChangeMin);
        
        // Angry mood changes activities faster
        const moodModifier = this.state.mood === 'angry' ? 0.5 : 1;
        
        if (activityTimer > changeTime * moodModifier) {
            this.changeActivity();
            this.state.timers.activity = 0;
        }
    }
    
    updatePhaseInteraction() {
        // Periodically interact with the phase boundaries
        if (this.state.timers.viewportInteraction > 20 + Math.random() * 15) {
            this.state.activity = 'phase_interaction';
            this.state.timers.viewportInteraction = 0;
            this.triggerPhaseInteraction();
        }
    }
    
    changeMood() {
        const currentMood = this.state.mood;
        let newMood;
        
        // Weighted mood transitions based on current mood
        switch (currentMood) {
            case 'mysterious':
                newMood = this.weightedChoice(['melancholic', 'playful', 'curious'], [0.4, 0.3, 0.3]);
                break;
            case 'melancholic':
                newMood = this.weightedChoice(['gentle', 'mysterious', 'curious'], [0.5, 0.3, 0.2]);
                break;
            case 'playful':
                newMood = this.weightedChoice(['ethereal', 'curious', 'gentle'], [0.6, 0.2, 0.2]);
                break;
            case 'gentle':
                newMood = this.weightedChoice(['playful', 'ethereal', 'curious'], [0.4, 0.4, 0.2]);
                break;
            case 'curious':
                newMood = this.weightedChoice(['playful', 'mysterious', 'ethereal'], [0.5, 0.3, 0.2]);
                break;
            default:
                newMood = this.config.moods[Math.floor(Math.random() * this.config.moods.length)];
        }
        
        this.state.mood = newMood;
    }
    
    changeActivity() {
        switch (this.state.activity) {
            case 'observing':
                if (Math.random() < 0.7) {
                    // Character no longer drifts - stays in center position
                    this.state.activity = 'observing';
                } else {
                    this.state.activity = 'performing';
                    this.state.isPerforming = true;
                }
                break;
                
            case 'drifting':
                // Removed drifting - character stays centered
                this.state.activity = 'observing';
                break;
                
            case 'performing':
                this.state.activity = 'observing';
                this.state.isPerforming = false;
                break;
                
            case 'phase_interaction':
                this.state.activity = 'observing';
                // Removed target position movement
                break;
        }
    }
    
    setRandomDriftTarget() {
        // Character no longer moves - stays centered at origin
        this.state.targetPosition = null;
    }
    
    setObservingPosition() {
        // Character stays in center position for viewport-contained display
        this.state.targetPosition = null;
    }
    
    triggerPhaseInteraction() {
        // Character performs phase interaction animations in place
        // No movement to boundaries - just visual effects
        this.state.targetPosition = null;
    }
    
    shouldSpeak() {
        const speakTimer = this.state.timers.speak;
        const speakTime = this.config.timers.speechMin + 
                         Math.random() * (this.config.timers.speechMax - this.config.timers.speechMin);
        
        // Melancholic mood speaks more frequently
        const moodModifier = this.state.mood === 'melancholic' ? 0.5 : 1;
        
        return speakTimer > speakTime * moodModifier;
    }
    
    shouldBlink() {
        const blinkTimer = this.state.timers.blink;
        const blinkTime = this.config.timers.blinkMin + 
                         Math.random() * (this.config.timers.blinkMax - this.config.timers.blinkMin);
        
        return blinkTimer > blinkTime;
    }
    
    getRandomPhrase(category) {
        const moodPhrases = this.phrases[this.state.mood];
        if (!moodPhrases) {
            console.error(`Invalid mood: ${this.state.mood}`);
            // Fallback to ethereal mood
            const fallbackPhrases = this.phrases.ethereal[category] || this.phrases.ethereal.observing;
            return fallbackPhrases[Math.floor(Math.random() * fallbackPhrases.length)];
        }
        
        const phraseList = moodPhrases[category] || moodPhrases.observing || this.phrases.ethereal.observing;
        if (!phraseList || phraseList.length === 0) {
            console.error(`No phrases found for mood: ${this.state.mood}, category: ${category}`);
            // Ultimate fallback
            const ultimateFallback = this.phrases.ethereal.observing;
            return ultimateFallback[Math.floor(Math.random() * ultimateFallback.length)];
        }
        
        return phraseList[Math.floor(Math.random() * phraseList.length)];
    }
    
    resetSpeechTimer() {
        this.state.timers.speak = 0;
    }
    
    resetBlinkTimer() {
        this.state.timers.blink = 0;
    }
    
    getFloatIntensity() {
        return this.state.mood === 'melancholic' ? 
               this.config.movement.gentleFloatIntensity : 
               this.config.movement.floatIntensity;
    }
    
    getArmSpeed() {
        switch (this.state.mood) {
            case 'playful': return 3;
            case 'ethereal': return 2.5;
            default: return 1.5; // Slower, more ethereal movement
        }
    }
    
    getMovementSpeed() {
        return this.state.activity === 'phase_interaction' ? 3 : this.config.movement.speed;
    }
    
    updatePerformanceBehavior() {
        // Fourth wall breaking behavior
        if (this.state.timers.fourthWallBreak > 8 + Math.random() * 12) {
            this.triggerFourthWallBreak();
            this.state.timers.fourthWallBreak = 0;
        }
        
        // Performance tricks
        if (this.state.timers.performanceTrick > 6 + Math.random() * 8) {
            this.triggerPerformanceTrick();
            this.state.timers.performanceTrick = 0;
        }
        
        // Audience engagement checks
        if (this.state.timers.audienceEngagement > 15) {
            if (this.state.audienceAttention < 30) {
                this.triggerAudienceEngagement();
            }
            this.state.timers.audienceEngagement = 0;
        }
        
        // Performance level escalation
        if (this.state.audienceAttention > 80) {
            this.state.performanceLevel = Math.min(5, this.state.performanceLevel + 0.01);
        }
    }
    
    triggerFourthWallBreak() {
        this.state.currentTrick = 'fourth_wall_break';
        this.state.activity = 'fourth_wall_break';
        this.state.audienceAttention = Math.min(100, this.state.audienceAttention + 25);
        
        // Character looks at viewer but stays in place
        this.state.targetPosition = null;
    }
    
    triggerPerformanceTrick() {
        const tricks = ['ethereal_pose', 'ethereal_dance', 'phase_shift', 'ethereal_display', 'gentle_bow'];
        this.state.currentTrick = tricks[Math.floor(Math.random() * tricks.length)];
        this.state.activity = 'performance_trick';
        this.state.lastPerformanceType = this.state.currentTrick;
        this.state.audienceAttention = Math.min(100, this.state.audienceAttention + 15);
        this.state.isPerforming = true;
    }
    
    triggerAudienceEngagement() {
        this.state.activity = 'audience_engagement';
        this.state.currentTrick = 'attention_seeking';
        this.state.audienceAttention = Math.min(100, this.state.audienceAttention + 20);
        
        // Character engages viewer with animations but stays in place
        this.state.targetPosition = null;
    }
    
    // Enhanced activity changes with performance focus
    changeActivity() {
        const currentActivity = this.state.activity;
        
        // Higher chance of performance activities in ethereal mood
        if (this.state.mood === 'ethereal') {
            const performanceActivities = ['performance_trick', 'fourth_wall_break', 'audience_engagement', 'showing_off'];
            if (Math.random() < 0.7) {
                this.state.activity = performanceActivities[Math.floor(Math.random() * performanceActivities.length)];
                this.triggerPerformanceTrick();
                return;
            }
        }
        
        switch (currentActivity) {
            case 'greeting_audience':
                this.state.activity = 'fourth_wall_break';
                this.triggerFourthWallBreak();
                break;
                
            case 'fourth_wall_break':
                this.state.activity = 'performance_trick';
                this.triggerPerformanceTrick();
                break;
                
            case 'performance_trick':
                this.state.activity = Math.random() < 0.6 ? 'showing_off' : 'audience_engagement';
                this.state.isPerforming = false;
                break;
                
            case 'showing_off':
                this.state.activity = 'performance_trick';
                this.triggerPerformanceTrick();
                break;
                
            case 'audience_engagement':
                this.state.activity = 'performance_trick';
                this.triggerPerformanceTrick();
                break;
                
            case 'observing':
                if (Math.random() < 0.7) {
                    this.state.activity = 'fourth_wall_break';
                    this.triggerFourthWallBreak();
                } else {
                    // Character stays in place instead of drifting
                    this.state.activity = 'performance_trick';
                    this.triggerPerformanceTrick();
                }
                break;
                
            case 'drifting':
                this.state.activity = 'performance_trick';
                this.triggerPerformanceTrick();
                break;
                
            case 'phase_interaction':
                this.state.activity = 'showing_off';
                // Character stays in place for all activities
                this.state.targetPosition = null;
                break;
                
            default:
                this.state.activity = 'fourth_wall_break';
                this.triggerFourthWallBreak();
        }
    }
    
    // Enhanced mood changes with performance focus
    changeMood() {
        const currentMood = this.state.mood;
        let newMood;
        
        // Ethereal mood is more likely and sticky
        if (currentMood === 'ethereal') {
            newMood = this.weightedChoice(['ethereal', 'mysterious', 'playful'], [0.6, 0.25, 0.15]);
        } else {
            newMood = this.weightedChoice(['ethereal', 'mysterious', 'playful', 'curious'], [0.5, 0.2, 0.2, 0.1]);
        }
        
        this.state.mood = newMood;
        
        // Reset to performance activity when entering ethereal mode
        if (newMood === 'ethereal' && currentMood !== 'ethereal') {
            this.state.activity = 'greeting_audience';
            this.state.audienceAttention = 100;
        }
    }
    
    getCurrentTrick() {
        return this.state.currentTrick;
    }
    
    getPerformanceLevel() {
        return this.state.performanceLevel;
    }
    
    isLookingAtViewer() {
        return ['fourth_wall_break', 'audience_engagement', 'greeting_audience'].includes(this.state.activity);
    }
    
    shouldShowSpotlight() {
        return this.state.isPerforming || this.state.activity === 'performance_trick';
    }
    
    weightedChoice(choices, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < choices.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return choices[i];
            }
        }
        
        return choices[choices.length - 1];
    }
}
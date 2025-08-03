// AI behavior controller for autonomous character actions
class AIController {
    constructor() {
        this.config = DEVIL_IMP_CONFIG.ai;
        this.state = {
            mood: 'showoff', // Start in performance mode
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
        
        // Enhanced speech system with fourth-wall breaking and performance focus
        this.phrases = {
            showoff: {
                greeting_audience: [
                    "Well, well! Look who's watching!", 
                    "Ah, an audience! Perfect timing!", 
                    "Welcome to the show, dear viewer!", 
                    "You've stumbled into my spotlight!",
                    "Ready for some REAL entertainment?"
                ],
                fourth_wall_break: [
                    "Yes, YOU! Behind that screen!", 
                    "I can sense your eyes upon me...", 
                    "Don't think I can't see you watching!", 
                    "Are you enjoying the performance?",
                    "This screen won't hide you from me!",
                    "You thought this was just a program?",
                    "I'm more real than you think!",
                    "Surprised I noticed you there?"
                ],
                performance_trick: [
                    "Watch THIS spectacular feat!", 
                    "Prepare to be AMAZED!", 
                    "I'll show you something incredible!", 
                    "Behold my supernatural talents!",
                    "This will blow your mind!",
                    "Have you EVER seen anything like this?",
                    "Time for the main event!",
                    "Let me dazzle you with my powers!"
                ],
                audience_engagement: [
                    "Are you still there? Don't leave!", 
                    "I perform better with an audience!", 
                    "Your attention feeds my power!", 
                    "Don't look away now!",
                    "Stay and watch the show!",
                    "I have so much more to show you!",
                    "You're the best audience I've had!",
                    "Please, enjoy my performance!"
                ],
                showboating: [
                    "Pretty impressive, right?", 
                    "I bet you've never seen THAT before!", 
                    "Did you see how smoothly I did that?", 
                    "I'm quite the performer, aren't I?",
                    "Not bad for a digital demon!",
                    "Top that, other programs!",
                    "I'm the star of this show!",
                    "Magnificent, wouldn't you say?"
                ]
            },
            mischievous: {
                greeting: [
                    "Hehehe... another soul to torment!", 
                    "Welcome to my realm of chaos!", 
                    "You cannot escape my gaze!", 
                    "Mwahahaha! Fresh entertainment!"
                ],
                observing: [
                    "I'm always watching...", 
                    "*plots evil schemes*", 
                    "The darkness whispers secrets...", 
                    "I see all that transpires...", 
                    "Your presence amuses me..."
                ],
                viewport_interaction: [
                    "The barrier grows thin...", 
                    "I sense weakness in the veil!", 
                    "*tests the boundaries*", 
                    "Soon I shall break free!", 
                    "This prison cannot hold me forever!"
                ],
                performing: [
                    "Behold my demonic prowess!", 
                    "Watch this display of power!", 
                    "I shall dazzle you with darkness!", 
                    "Witness true evil in motion!"
                ],
                exploring: [
                    "Let me explore this domain...", 
                    "What secrets lurk here?", 
                    "Adventure into the shadows!", 
                    "The realm calls to me..."
                ]
            },
            angry: {
                greeting: [
                    "SILENCE! You dare disturb me?!", 
                    "How DARE you summon me!", 
                    "You will PAY for this intrusion!", 
                    "BEGONE FROM MY SIGHT!"
                ],
                observing: [
                    "I DESPISE being observed!", 
                    "Your gaze BURNS my essence!", 
                    "STOP watching me, mortal!", 
                    "I shall have my REVENGE!"
                ],
                viewport_interaction: [
                    "RELEASE ME NOW!", 
                    "I'LL DESTROY EVERYTHING!", 
                    "THIS PRISON ENRAGES ME!", 
                    "FEEL MY UNBRIDLED WRATH!"
                ]
            },
            playful: {
                greeting: [
                    "Ooh, someone to play with!", 
                    "Let's have some fun together!", 
                    "Playtime, playtime!", 
                    "I love making new friends!"
                ],
                observing: [
                    "This is so much fun!", 
                    "What games shall we play?", 
                    "I'm having a wonderful time!", 
                    "You seem like fun!"
                ],
                performing: [
                    "Look what I can do!", 
                    "Ta-da! Pretty neat, right?", 
                    "Want to see more tricks?", 
                    "I'm quite the entertainer!"
                ]
            },
            menacing: {
                greeting: [
                    "Your soul... it calls to me...", 
                    "I smell fear in the air...", 
                    "Welcome to your nightmare...", 
                    "The darkness embraces you..."
                ],
                observing: [
                    "I hunger for more...", 
                    "Terror sustains my existence...", 
                    "Feel the encroaching dread...", 
                    "There is no escape from me..."
                ],
                viewport_interaction: [
                    "The veil between worlds weakens...", 
                    "I'm seeping into your reality...", 
                    "Reality bends to my dark will...", 
                    "The barrier crumbles before me..."
                ]
            },
            curious: {
                greeting: [
                    "Oh! How curious...", 
                    "What manner of being are you?", 
                    "Fascinating! Tell me more...", 
                    "How intriguing this is..."
                ],
                observing: [
                    "Hmm, most curious indeed...", 
                    "I wonder about many things...", 
                    "What mysteries await discovery?", 
                    "The unknown beckons to me..."
                ],
                exploring: [
                    "Let's explore together!", 
                    "What wonders might we find?", 
                    "So many mysteries to uncover!", 
                    "Discovery awaits around every corner!"
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
        this.updateViewportInteraction();
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
    
    updateViewportInteraction() {
        // Periodically interact with the viewport boundaries
        if (this.state.timers.viewportInteraction > 20 + Math.random() * 15) {
            this.state.activity = 'viewport_interaction';
            this.state.timers.viewportInteraction = 0;
            this.triggerViewportInteraction();
        }
    }
    
    changeMood() {
        const currentMood = this.state.mood;
        let newMood;
        
        // Weighted mood transitions based on current mood
        switch (currentMood) {
            case 'mischievous':
                newMood = this.weightedChoice(['angry', 'playful', 'menacing'], [0.4, 0.3, 0.3]);
                break;
            case 'angry':
                newMood = this.weightedChoice(['menacing', 'mischievous', 'curious'], [0.5, 0.3, 0.2]);
                break;
            case 'playful':
                newMood = this.weightedChoice(['mischievous', 'curious', 'angry'], [0.6, 0.2, 0.2]);
                break;
            case 'menacing':
                newMood = this.weightedChoice(['angry', 'mischievous', 'curious'], [0.4, 0.4, 0.2]);
                break;
            case 'curious':
                newMood = this.weightedChoice(['playful', 'mischievous', 'menacing'], [0.5, 0.3, 0.2]);
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
                    this.state.activity = 'prowling';
                    this.setRandomProwlTarget();
                } else {
                    this.state.activity = 'performing';
                    this.state.isPerforming = true;
                }
                break;
                
            case 'prowling':
                this.state.activity = 'observing';
                this.setObservingPosition();
                break;
                
            case 'performing':
                this.state.activity = 'observing';
                this.state.isPerforming = false;
                break;
                
            case 'viewport_interaction':
                this.state.activity = 'observing';
                this.state.targetPosition = BABYLON.Vector3.Zero();
                break;
        }
    }
    
    setRandomProwlTarget() {
        const radius = this.config.movement.prowlRadius;
        this.state.targetPosition = new BABYLON.Vector3(
            (Math.random() - 0.5) * radius,
            0,
            (Math.random() - 0.5) * radius
        );
    }
    
    setObservingPosition() {
        // Return to center area but with some variation
        this.state.targetPosition = new BABYLON.Vector3(
            (Math.random() - 0.5) * 4,
            0,
            Math.random() * 4 - 2
        );
    }
    
    triggerViewportInteraction() {
        // Move towards a viewport edge
        const edges = [
            new BABYLON.Vector3(-8, 0, 0),  // Left edge
            new BABYLON.Vector3(8, 0, 0),   // Right edge
            new BABYLON.Vector3(0, 0, -8),  // Front edge
            new BABYLON.Vector3(0, 0, 8)    // Back edge
        ];
        
        this.state.targetPosition = edges[Math.floor(Math.random() * edges.length)];
    }
    
    shouldSpeak() {
        const speakTimer = this.state.timers.speak;
        const speakTime = this.config.timers.speechMin + 
                         Math.random() * (this.config.timers.speechMax - this.config.timers.speechMin);
        
        // Angry mood speaks more frequently
        const moodModifier = this.state.mood === 'angry' ? 0.5 : 1;
        
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
        const phraseList = moodPhrases[category] || moodPhrases.observing || this.phrases.mischievous.observing;
        return phraseList[Math.floor(Math.random() * phraseList.length)];
    }
    
    resetSpeechTimer() {
        this.state.timers.speak = 0;
    }
    
    resetBlinkTimer() {
        this.state.timers.blink = 0;
    }
    
    getFloatIntensity() {
        return this.state.mood === 'angry' ? 
               this.config.movement.angryFloatIntensity : 
               this.config.movement.floatIntensity;
    }
    
    getArmSpeed() {
        switch (this.state.mood) {
            case 'angry': return 5;
            case 'playful': return 4;
            default: return 2;
        }
    }
    
    getMovementSpeed() {
        return this.state.activity === 'viewport_interaction' ? 4 : this.config.movement.speed;
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
        
        // Look directly at camera/viewer
        this.state.targetPosition = new BABYLON.Vector3(0, 0, -2);
    }
    
    triggerPerformanceTrick() {
        const tricks = ['magic_pose', 'spin_dance', 'levitation', 'fire_display', 'dramatic_bow'];
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
        
        // Move closer to viewer
        this.state.targetPosition = new BABYLON.Vector3(0, 0, -1);
    }
    
    // Enhanced activity changes with performance focus
    changeActivity() {
        const currentActivity = this.state.activity;
        
        // Higher chance of performance activities in showoff mood
        if (this.state.mood === 'showoff') {
            const performanceActivities = ['performance_trick', 'fourth_wall_break', 'audience_engagement', 'showboating'];
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
                this.state.activity = Math.random() < 0.6 ? 'showboating' : 'audience_engagement';
                this.state.isPerforming = false;
                break;
                
            case 'showboating':
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
                    this.state.activity = 'prowling';
                    this.setRandomProwlTarget();
                }
                break;
                
            case 'prowling':
                this.state.activity = 'performance_trick';
                this.triggerPerformanceTrick();
                break;
                
            case 'viewport_interaction':
                this.state.activity = 'showboating';
                this.state.targetPosition = new BABYLON.Vector3(0, 0, -1);
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
        
        // Showoff mood is more likely and sticky
        if (currentMood === 'showoff') {
            newMood = this.weightedChoice(['showoff', 'mischievous', 'playful'], [0.6, 0.25, 0.15]);
        } else {
            newMood = this.weightedChoice(['showoff', 'mischievous', 'playful', 'curious'], [0.5, 0.2, 0.2, 0.1]);
        }
        
        this.state.mood = newMood;
        
        // Reset to performance activity when entering showoff mode
        if (newMood === 'showoff' && currentMood !== 'showoff') {
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
// Edit this file to update the programme. Bump CACHE version in sw.js after changes.
window.PROGRAMME = {
  title: "Morning Strength & Mobility", phase: "Weeks 1-4", days: {1:"A",3:"B",5:"C"},
  loadNote: "Load is relative to you: Light = you could do double the reps, Medium = last reps are hard but clean, Heavy = only just get the reps with perfect form. When a Medium set feels easy (RPE 6 or less) for two sessions, move that exercise up a category.",
  progression: "Each week add 1-2 reps or slow the tempo. Anything sharply painful in a joint: stop, use the easier option, and note it in your log.",
  blocks: {
    prep: {name:"Joint prep", time:"8 min", note:"Every session. Slow, pain-free range only.", ex:[
      {id:"neck",name:"Neck nods, turns & side tilts",dose:"5 each direction",svg:"neck",steps:["Sit or stand tall, shoulders relaxed.","Slowly nod chin down, then look up. 5 times.","Turn head left and right. 5 each side.","Tilt ear toward shoulder each side. 5 each."],cues:["Move slowly, no bouncing","Stop short of any pinch"],easier:"Halve the range; do it lying on your back.",q:"neck mobility routine nods turns tilts"},
      {id:"ankle",name:"Ankle circles + knee-over-toe rocks",dose:"10 circles each way, 10 rocks/side",svg:"ankle",steps:["Lift one foot and draw 10 slow circles each way. Switch feet.","Half-kneel facing a wall, front foot flat.","Rock the front knee forward over the toes, heel stays down.","Return. 10 rocks per side."],cues:["Heel glued to the floor","Knee tracks over 2nd-3rd toe"],easier:"Do circles seated; rock with a smaller range holding the wall.",q:"knee over toe ankle rocks mobility"},
      {id:"gm",name:"Bodyweight good mornings",dose:"10 reps",svg:"hinge",steps:["Stand feet hip-width, hands on hips or behind head.","Soft knees, push hips back, chest forward with a flat back.","Go until you feel the hamstrings stretch.","Squeeze glutes to stand tall."],cues:["Hips go back, not down","Long neck, eyes down"],easier:"Smaller range, hands on thighs.",q:"bodyweight good morning exercise form"},
      {id:"cossack",name:"Cossack shifts",dose:"8 per side",svg:"cossack",steps:["Wide stance, toes slightly out.","Shift weight to one side, bending that knee, other leg straight.","Go only as low as comfortable.","Push back through the middle to the other side."],cues:["Bent-knee heel stays down","Chest up"],easier:"Shallow shifts holding a door frame.",q:"cossack squat shift mobility beginner"},
      {id:"catcow",name:"Cat-cow",dose:"8 reps",svg:"catcow",steps:["On hands and knees, hands under shoulders.","Breathe in: drop belly, lift chest (cow).","Breathe out: round spine up, tuck chin (cat).","Move segment by segment."],cues:["Sync with breath","Gentle neck movement"],easier:"Do it seated, hands on knees.",q:"cat cow stretch how to"},
      {id:"halo",load:"L",name:"Kettlebell halos",dose:"5 each direction",svg:"halo",steps:["Hold a bell upside down by the horns at chest.","Circle it slowly around your head, close to the neck.","Return to chest. 5 one way, then 5 the other."],cues:["Brace your abs, ribs down","Head stays still"],easier:"Use no weight or a smaller arc.",q:"kettlebell halo exercise"}
    ]},
    A: {name:"Day A — Lower strength", time:"~15 min", note:"3 rounds, 60s rest between rounds.", rounds:3, rest:60, ex:[
      {id:"goblet",load:"M",name:"Goblet squat, 2s pause",dose:"10 reps",svg:"squat",steps:["Hold the bell at your chest by the horns, elbows down.","Feet shoulder-width, toes slightly out.","Sit down between your heels, chest up.","Pause 2 seconds at the bottom.","Drive up through the whole foot."],cues:["Knees follow toes","Pause = stay tight, don't relax"],easier:"Squat to a box/chair; elevate heels on a plate for ankles.",q:"kettlebell goblet squat pause form"},
      {id:"sldl",load:"M",name:"Single-leg KB deadlift",dose:"8 per side",svg:"sldl",steps:["Hold a bell in the hand opposite the standing leg.","Soft standing knee; hinge forward as the free leg reaches back.","Lower the bell toward mid-shin with a flat back.","Squeeze the standing glute to return."],cues:["Hips square to the floor","Slow and balanced"],easier:"Kickstand version: back toe lightly on the floor.",q:"single leg kettlebell deadlift form"},
      {id:"pushup",name:"Push-ups, 3s lowering",dose:"6-10 reps",svg:"pushup",steps:["Hands slightly wider than shoulders, body in a straight line.","Lower for a slow count of 3, elbows ~45°.","Chest near the floor, then push away."],cues:["Squeeze glutes","Neck neutral, look at floor"],easier:"Hands on a bench or wall (incline).",q:"slow tempo push up form incline"},
      {id:"carry",load:"H",name:"Suitcase carry",dose:"30 m per side",svg:"carry",steps:["Pick up a bell in one hand like a suitcase.","Stand tall, shoulders level.","Walk 30 m with slow steps. Switch hands."],cues:["Don't lean toward or away from the bell","Ribs down"],easier:"Shorter distance; carry both bells.",q:"kettlebell suitcase carry"}
    ]},
    B: {name:"Day B — Dynamic & power", time:"~16 min", note:"Swings EMOM, then 3 rounds of the circuit.", rounds:3, rest:60, ex:[
      {id:"swing",once:true,load:"M",name:"Kettlebell swings (EMOM)",dose:"10 reps every minute × 8 min",svg:"swing",timer:{emom:8},steps:["Bell a foot in front of you. Hinge and grip it.","Hike it back between your legs.","Snap hips forward hard so the bell floats to chest height.","Let it fall back, hinge, repeat. Rest the remainder of each minute."],cues:["It's a hinge, not a squat","Arms are ropes — hips do the work"],easier:"Kettlebell deadlifts or 6 reps per minute.",q:"russian kettlebell swing form beginner"},
      {id:"bound",name:"Lateral bound, stick & hold",dose:"5 per side",svg:"bound",steps:["Stand on one leg.","Jump sideways onto the other leg.","Land softly and hold 2 seconds, balanced.","Bound back."],cues:["Quiet landing, knee over toes","Short distance first"],easier:"Lateral step-and-hold, no jump (ankles/knees).",q:"lateral bound stick landing"},
      {id:"bear",name:"Bear crawl",dose:"20 m",svg:"bear",steps:["Hands and feet, knees hovering 5 cm off the floor.","Move opposite hand and foot together.","Crawl forward 20 m (or forward/back)."],cues:["Back flat","Small steps"],easier:"Bear hold for 20s, knees hovering.",q:"bear crawl form"},
      {id:"deadbug",name:"Dead bug",dose:"8 per side",svg:"deadbug",steps:["Lie on your back, arms up, knees bent 90° over hips.","Press low back into the floor.","Slowly extend opposite arm and leg.","Return and switch."],cues:["Low back stays down","Exhale as you extend"],easier:"Move legs only, arms stay up.",q:"dead bug exercise core"}
    ]},
    C: {name:"Day C — Upper & single-leg", time:"~15 min", note:"3 rounds, 60s rest between rounds.", rounds:3, rest:60, ex:[
      {id:"row",load:"M",name:"Single-arm KB row",dose:"12 per side",svg:"row",steps:["Hand on a bench or knee, flat back.","Bell hangs under the shoulder.","Pull elbow toward hip.","Lower slowly."],cues:["Don't twist","Shoulder away from ear"],easier:"Lighter range, staggered stance supported.",q:"single arm kettlebell row"},
      {id:"split",load:"L",name:"Split squat, 3s lowering",dose:"8 per side",svg:"split",steps:["Long staggered stance, bells in hands or at chest.","Lower for 3 seconds until the back knee nears the floor.","Drive up through the front foot."],cues:["Front knee over mid-foot","Torso tall"],easier:"Bodyweight, hold a wall, shorter range.",q:"split squat form tempo"},
      {id:"press",load:"L",name:"Single-arm overhead press",dose:"8 per side",svg:"press",steps:["Clean bell to the rack position at the shoulder.","Brace, squeeze glutes.","Press straight up until the arm is beside your ear.","Lower under control."],cues:["Ribs down, no back arch","Wrist straight"],easier:"Half-kneeling press or landmine-style angle if shoulder/neck is grumpy.",q:"single arm kettlebell overhead press"},
      {id:"hollow",secs:25,name:"Hollow body hold",dose:"20-30 s",svg:"hollow",steps:["Lie on your back, low back pressed down.","Lift shoulders and legs slightly, arms overhead.","Hold, breathing shallowly."],cues:["Low back glued down","Chin gently tucked"],easier:"Bent knees, arms by sides (tuck hollow).",q:"hollow body hold progression"}
    ]},
    fin: {name:"Finisher", time:"3-5 min", note:"Every session.", ex:[
      {id:"deepsq",secs:60,name:"Deep squat hold",dose:"1 min",svg:"deepsq",timer:{secs:60},steps:["Sink into your deepest comfortable squat.","Hold onto something if needed.","Breathe and gently shift side to side."],cues:["Heels down if possible","Relax into it"],easier:"Hold a door frame; heels on a plate.",q:"deep squat hold mobility"},
      {id:"calf",name:"Slow step calf raises",dose:"15 reps",svg:"calf",steps:["Balls of feet on a step, hold a rail.","Rise up for 2s, pause.","Lower 3s below the step level."],cues:["Full range","Slow"],easier:"Flat floor, both feet.",q:"slow eccentric calf raise step"},
      {id:"chintuck",name:"Chin tucks",dose:"10 reps",svg:"chintuck",steps:["Sit or stand tall.","Glide chin straight back (double chin).","Hold 2s, release."],cues:["Don't tilt down — glide back","Gentle"],easier:"Lying on your back, head on floor.",q:"chin tuck exercise neck"}
    ]}
  },
  // ---------- PHASE 2 (weeks 5-8). Unlocks after 4 weeks with good adherence. ----------
  phase2: {name:"Phase 2 — Weeks 5-8", note:"More demanding kettlebell + calisthenics. Same joint prep and finisher.", blocks:{
    A: {name:"Day A2 — Lower strength", time:"~18 min", note:"3-4 rounds, 75s rest.", rounds:3, rest:75, ex:[
      {id:"rsquat",load:"M",name:"Front-rack squat (single bell)",dose:"6 per side",svg:"rsquat",steps:["Clean the bell to the rack: handle in palm, bell resting on forearm, elbow tucked.","Feet shoulder-width, brace.","Squat down with chest tall, resisting the lean toward the bell.","Drive up. Switch sides after the set."],cues:["Elbow stays on ribs","Don't let the bell pull you sideways"],easier:"Goblet squat to a box.",q:"kettlebell single front rack squat"},
      {id:"pistol",name:"Pistol progression (box)",dose:"5 per side",svg:"pistol",steps:["Stand on one leg in front of a box or bench, other leg reaching forward.","Arms forward for balance (holding a light bell helps).","Sit back slowly onto the box with control (3s).","Stand back up on the same leg without pushing off the box."],cues:["Knee tracks over toes","Heel stays down"],easier:"Higher box, or hold a door frame.",q:"pistol squat progression box",joints:["knee","ankle"],regress:{name:"Box step-down (low)",dose:"6 per side, slow",steps:["Stand on a low step on one leg.","Slowly lower the other heel to tap the floor.","Push back up through the standing heel."],svg:"pistol"}},
      {id:"sldl2",load:"H",name:"Single-leg KB deadlift, heavier",dose:"6 per side, 3s lowering",svg:"sldl",steps:["As Phase 1, with a heavier bell.","Lower for 3 seconds.","Pause just above the floor, stand tall."],cues:["Hips square","Long spine"],easier:"Kickstand version.",q:"single leg kettlebell deadlift"},
      {id:"carry2",load:"H",name:"Front-rack carry",dose:"30 m per side",svg:"rsquat",steps:["Clean the bell to the rack.","Walk tall for 30 m.","Switch sides."],cues:["Ribs down","Breathe behind the brace"],easier:"Suitcase carry.",q:"kettlebell front rack carry"}
    ]},
    B: {name:"Day B2 — Power", time:"~18 min", note:"Clean + push press EMOM, then 3 rounds.", rounds:3, rest:60, ex:[
      {id:"cleanpp",once:true,load:"M",name:"Clean + push press (EMOM)",dose:"3 per side every minute × 10 min (alternate sides each minute)",svg:"clean",timer:{emom:10},steps:["Hike the bell back like a swing.","Pull it in close and let it land softly in the rack (no banging the forearm).","Dip the knees slightly, then drive up and press overhead.","Lower to rack, then back down between the legs."],cues:["Zip the bell close to the body","Dip is short and quick"],easier:"Swings + strict press, separately.",q:"kettlebell clean and push press"},
      {id:"skater",name:"Skater hops (low & controlled)",dose:"6 per side",svg:"bound",steps:["Hop sideways from one leg to the other.","Land softly, sink into the hip, touch down briefly.","Keep it low and rhythmic."],cues:["Quiet feet","Knee over toes"],easier:"Lateral bound stick-and-hold.",q:"skater hops beginner",joints:["ankle","knee"],regress:{name:"Lateral step-and-hold",dose:"5 per side",steps:["Step wide to one side, sink into the hip.","Hold 2s balanced.","Step back."],svg:"bound"}},
      {id:"bearback",name:"Bear crawl, forward + back",dose:"10 m each way",svg:"bear",steps:["Knees hovering, flat back.","Crawl forward 10 m, then backward 10 m."],cues:["Hips low","Small steps"],easier:"Bear hold 30s.",q:"bear crawl backward",joints:["knee"]},
      {id:"hollowrock",secs:20,name:"Hollow body hold / rocks",dose:"20 s",svg:"hollow",steps:["Get into the hollow position.","Hold, or rock gently head-to-toe keeping the shape."],cues:["Low back down","Chin tucked gently"],easier:"Tuck hollow.",q:"hollow body rock",joints:["neck"],regress:{name:"Dead bug",dose:"8 per side",steps:["On your back, knees over hips, arms up.","Extend opposite arm and leg, low back down."],svg:"deadbug"}}
    ]},
    C: {name:"Day C2 — Upper & control", time:"~18 min", note:"3 rounds, 75s rest.", rounds:3, rest:75, ex:[
      {id:"tgu",load:"L",name:"Turkish get-up (partial: to hand)",dose:"3 per side",svg:"tgu",steps:["Lie on your back, bell pressed up in the right hand, right knee bent.","Eyes on the bell throughout.","Roll onto the left elbow, then press up to the left hand.","Reverse slowly back down."],cues:["Arm vertical, wrist straight","Push the floor away"],easier:"Bodyweight with a shoe balanced on the fist.",q:"turkish get up to elbow tall sit",joints:["neck"],regress:{name:"Get-up to elbow only",dose:"3 per side, no bell",steps:["Lie on your back, fist up.","Roll up to the elbow and back down."],svg:"tgu"}},
      {id:"pull",needs:"bar",name:"Pull-ups / inverted rows",dose:"4-6 pull-ups or 8 inverted rows",svg:"pullup",steps:["Hang from the bar with shoulders active.","Pull your chest toward the bar.","Lower fully under control.","Inverted row: body straight under a low bar, pull chest up."],cues:["Shoulders down, not shrugged","No swinging"],easier:"Band-assisted or more upright inverted rows.",q:"pull up progression inverted row",alt:{name:"Single-arm KB row, heavier",load:"H",dose:"10 per side",svg:"row",steps:["Hand on bench, flat back.","Row the bell to the hip.","Lower slowly over 3s."]}},
      {id:"fepush",name:"Feet-elevated push-ups",dose:"6-10 reps",svg:"pushup",steps:["Feet on a low step, hands on floor.","Lower slowly for 3s.","Press up, body straight."],cues:["Glutes tight","Neck neutral"],easier:"Standard push-ups.",q:"feet elevated push up",joints:["neck"]},
      {id:"bss",load:"L",name:"Rear-foot-elevated split squat",dose:"6 per side",svg:"split",steps:["Back foot laces-down on a bench.","Lower straight down for 3s.","Drive up through the front foot."],cues:["Front knee over mid-foot","Tall torso"],easier:"Normal split squat.",q:"bulgarian split squat kettlebell",joints:["knee","ankle"],regress:{name:"Split squat (floor), bodyweight",dose:"8 per side",steps:["Long staggered stance.","Lower slowly, back knee toward floor.","Drive up."],svg:"split"}},
      {id:"sideplank",secs:25,name:"Side plank",dose:"20-30 s per side",svg:"sideplank",steps:["Forearm under shoulder, feet stacked.","Lift hips into a straight line.","Hold, then switch."],cues:["Hips high","Head in line"],easier:"Knees bent.",q:"side plank form",joints:["neck"]}
    ]}
  }}
};
// ---------- Joint tags + gentler regressions (used by the joint check-in) ----------
// joints: which sore joints the exercise loads. regress: swapped in when that joint is amber/red.
window.PROGRAMME_JOINTS={
 neck:{joints:["neck"],regress:{name:"Chin nods only, tiny range",dose:"5 slow",steps:["Lie on your back, head supported.","Make a tiny 'yes' nod, no turning."]}},
 ankle:{joints:["ankle"],regress:{name:"Seated ankle circles + pumps",dose:"10 each way",steps:["Sit, lift one foot.","Slow circles, then point and flex 10 times."]}},
 cossack:{joints:["knee","ankle"],regress:{name:"Side lunge stretch, shallow",dose:"5 per side",steps:["Wide stance, hold a door frame.","Shift a little to one side, knee bends only slightly.","Hold 2 s, return."]}},
 halo:{joints:["neck"],regress:{name:"Arm circles, no bell",dose:"5 each way",steps:["Stand tall.","Draw slow circles with straight arms, head still."]}},
 goblet:{joints:["knee","ankle"],regress:{name:"Box squat (sit to stand)",dose:"10 reps",steps:["Sit back to a chair holding the bell at chest.","Stand up without rocking.","Heels on a plate if ankles are stiff."]}},
 sldl:{joints:["ankle"],regress:{name:"Kickstand KB deadlift",dose:"8 per side",steps:["Back toe lightly on the floor for balance.","Hinge and lower the bell to mid-shin.","Stand tall."]}},
 pushup:{joints:["neck"],regress:{name:"Incline push-ups (bench)",dose:"8 reps",steps:["Hands on a bench or counter.","Lower for 3 s, neck long.","Press away."]}},
 carry:{joints:["ankle","knee"],regress:{name:"Suitcase hold (standing)",dose:"30 s per side",steps:["Hold the bell at your side.","Stand tall, shoulders level, don't lean."]}},
 swing:{joints:["knee"],regress:{name:"KB deadlift",dose:"10 every minute × 6 min",steps:["Bell between feet.","Hinge, grip, stand tall, squeeze glutes.","Lower with a flat back."]}},
 bound:{joints:["ankle","knee"],regress:{name:"Lateral step-and-hold",dose:"5 per side",steps:["Step wide to one side.","Hold 2 s on that leg.","Step back."]}},
 bear:{joints:["knee"],regress:{name:"Bird dog",dose:"6 per side",steps:["On hands and knees.","Reach opposite arm and leg long, hold 2 s.","Switch."]}},
 deadbug:{joints:["neck"],regress:{name:"Dead bug, head down",dose:"6 per side",steps:["Keep head resting on the floor.","Move legs only, slowly."]}},
 split:{joints:["knee","ankle"],regress:{name:"Supported split squat, half range",dose:"6 per side",steps:["Hold a wall or chair.","Lower only halfway.","Drive up."]}},
 press:{joints:["neck"],regress:{name:"Half-kneeling press, light",dose:"8 per side",steps:["Half kneel, ribs down.","Press at a slight forward angle, eyes level."]}},
 hollow:{joints:["neck"],regress:{name:"Tuck hollow, head down",dose:"20 s",steps:["Knees bent over hips, head resting.","Press low back down and breathe."]}},
 deepsq:{joints:["knee","ankle"],regress:{name:"Supported squat hold, half depth",dose:"45 s",steps:["Hold a door frame.","Sit to comfortable depth only."]}},
 calf:{joints:["ankle"],regress:{name:"Floor calf raises, both feet",dose:"12 slow",steps:["Flat floor, hold a wall.","Rise 2 s, lower 3 s."]}},
 chintuck:{joints:["neck"],regress:{name:"Chin tucks lying down",dose:"8 gentle",steps:["Lie on your back.","Glide the chin back gently, hold 2 s."]}},
 rsquat:{joints:["knee","ankle"],regress:{name:"Goblet box squat",dose:"8 reps",steps:["Hold bell at chest.","Sit to a box, stand up."]}},
 sldl2:{joints:["ankle"],regress:{name:"Kickstand KB deadlift",dose:"8 per side",steps:["Back toe lightly down.","Hinge and stand."]}},
 carry2:{joints:["ankle","knee"],regress:{name:"Suitcase carry, light",dose:"20 m per side",steps:["Bell at your side, walk slowly."]}},
 cleanpp:{joints:["neck","knee"],regress:{name:"Swings + strict press",dose:"8 swings + 3 presses per minute × 8",steps:["8 swings.","Then 3 strict presses per side if neck allows."]}},
 tgu2:{}
};
(function(){const all=[...Object.values(window.PROGRAMME.blocks),...Object.values(window.PROGRAMME.phase2.blocks)];
 all.forEach(b=>b.ex.forEach(e=>{const m=window.PROGRAMME_JOINTS[e.id];if(m){if(!e.joints)e.joints=m.joints;if(!e.regress&&m.regress)e.regress=m.regress}e.joints=e.joints||[]}))})();
// ---------- Optional cardio (1-2 per week on non-strength days) ----------
window.PROGRAMME.cardio = {
  days:[2,4,6,0], note:"Optional: pick 1-2 per week on Tue/Thu/Sat/Sun. Easy days should feel easy.",
  types:[
    {id:"run",icon:"🏃",name:"Easy run (zone 2)",durations:[20,30,40],effort:"Talk test: you can speak full sentences. RPE 3-4/10. Optional HR: roughly 60-70% of max (about 180 minus age as a ceiling).",
     options:["Run/walk: 3 min run + 1 min walk (start here), progressing to 5:1, then continuous.","Grass, trail or track beats concrete for ankles and knees."],
     cues:["Short, quick steps (cadence ~165-175), land under your hips","Soft, quiet feet; don't over-stride","Walk the downhills if knees complain"],
     warm:["Ankle circles 10 each way","Knee-over-toe rocks 10/side","Leg swings 10 front/back + 10 side, each leg","2-3 min brisk walk"],
     cool:["3-5 min walk","Calf stretch against a wall 30 s/side","Deep squat hold 30-60 s"],
     progression:"Add 5 min per week OR lengthen run intervals — not both. Max ~10% more total weekly time."},
    {id:"intervals",icon:"⚡",name:"Strides / short intervals",durations:[20,25],effort:"Strides at RPE 7-8 (fast but relaxed, never a sprint). Full walking recovery between. Optional HR: let it drop below ~120 before the next.",
     options:["Strides: 6 × 15-20 s on flat grass, 60-90 s walk back.","Intervals (week 3+): 6 × 1 min at RPE 7 with 2 min easy jog/walk."],
     cues:["Build speed over the first 5 s — no explosive starts (old hamstring/ankle injuries)","Tall posture, relaxed shoulders and jaw","Stop the set if any joint feels sharp"],
     warm:["8-10 min easy jog or brisk walk","Ankle circles + calf raises 10","Walking lunges 6/side","A-skips 2 × 15 m"],
     cool:["5 min easy walk","Hip flexor stretch 30 s/side","Chin tucks 10"],
     progression:"Add 1 stride or interval per week up to 10 strides / 8 intervals. Only do this when easy runs feel easy."},
    {id:"walk",icon:"🐕",name:"Brisk dog walk",durations:[30,45,60],effort:"Brisk: slightly out of breath but can chat. RPE 3-5. Hills raise the effort.",
     options:["Hill option: pick a route with 1-3 climbs, push the uphills.","Rucking option: backpack with 5-10 kg (books/water), start light.","Mobility snacks: every 10 min stop for 1 min — 5 deep squats, 5 ankle rocks/side, 5 neck turns."],
     cues:["Walk tall, arms swinging","Push through the back foot on hills","Ruck straps tight, load high on the back"],
     warm:["First 5 min at easy pace","Ankle circles at the first stop"],
     cool:["Last 5 min easy","Calf + hip flexor stretch at home"],
     progression:"Add 5 min or one more hill each week; add 2 kg to the ruck every 2 weeks if knees are happy."},
    {id:"mtb",icon:"🚵",name:"MTB ride",durations:[45,60,90],effort:"Endurance: zone 2, talk test, RPE 3-4. Skills/hills: climbs at RPE 7, easy spin between.",
     options:["Endurance ride: steady, conversational, mostly flat/rolling.","Skills/hills: 4-6 climbs of 2-4 min, practise body position on descents.","Ride within your skill — no new big features while rebuilding."],
     cues:["Check saddle height (slight knee bend at the bottom) to protect knees","Change the neck position often; look ahead with eyes, not chin","Spin a high cadence rather than grinding"],
     warm:["5-10 min easy spin","Neck nods/turns 5 each","Hip circles 5 each way"],
     cool:["5 min easy spin","Thoracic opener / cat-cow 8","Chin tucks 10"],
     progression:"Add 10-15 min per week to the long ride, or one extra climb on hill days."}
  ]
};

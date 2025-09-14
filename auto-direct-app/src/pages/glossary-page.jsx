import React, { useState } from "react";

const GlossaryPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");

  const glossaryItems = [
    // A
    {
      term: "ABS (Anti-Skid Braking System)",
      description: "Modern electronics and a hydraulic actuator compares and adjusts wheel speeds when braking to prevent wheel lock-up and hence a potential skid.",
      category: "Safety"
    },
    {
      term: "Active All-Wheel Drive (Active AWD)",
      description: "System developed to provide enhanced control and improved fuel economy. Active AWD is a compact system that controls torque distribution between the front and rear axles using an electromagnetic coupling in the rear differential housing.",
      category: "Drivetrain"
    },
    {
      term: "Active Braking with intelligence (AB-i)",
      description: "A system designed to help stop quickly and safely in an emergency. The AB-i system uses continuous feedback from sensors in the wheels to ensure that brake force is applied as effectively as possible whatever the driving conditions.",
      category: "Safety"
    },
    {
      term: "Active Cruise Control (ACC)",
      description: "Also known as Radar Cruise Control, this system uses radar to maintain a safe distance between you and the vehicle in front. If the vehicle in front slows down, the system will register this and slow down too.",
      category: "Technology"
    },
    {
      term: "Airbags",
      description: "Designed to inflate and absorb impact energy to help protect vehicle occupants in the event of a collision. They are usually activated by means of controlled pyrotechnics triggered by impact.",
      category: "Safety"
    },
    {
      term: "Air Conditioning",
      description: "Uses engine power to cool the air in a car's ventilation system. More advanced systems include multi-zone Climate Control air conditioning, which allows different areas of the car to be maintained at different temperatures.",
      category: "Comfort"
    },
    {
      term: "All Wheel Drive (AWD)",
      description: "An always-on 4 wheel drive (4WD) system, which gives you more control on uneven and slippery surfaces.",
      category: "Drivetrain"
    },
    {
      term: "Anti-intrusion beams",
      description: "Beams placed in the side doors to protect the occupants in the event of a side impact to the vehicle.",
      category: "Safety"
    },
    {
      term: "Automatic High Beam (AHB)",
      description: "Sometimes known as 'smart beam' or 'high beam assist', this technology detects the head and tail lights of vehicles on the road in front of you, and automatically dips your lights so as not to dazzle other drivers.",
      category: "Technology"
    },
    // B
    {
      term: "Blind Spot Monitor (BSM)",
      description: "Uses radar to monitor the car's blind spots. It indicates if there is another vehicle hidden by a blind spot and creates a warning indication in the appropriate side mirror.",
      category: "Safety"
    },
    {
      term: "Bluetooth™",
      description: "A short-range wireless communication system ideally suited to hands-free use of mobile telephones in cars.",
      category: "Technology"
    },
    {
      term: "Brake Assist (BA)",
      description: "A system designed to assist the driver in emergency braking, where the driver cannot apply the high pedal force required to obtain the shortest possible braking distance.",
      category: "Safety"
    },
    // C
    {
      term: "Central Locking",
      description: "Gives you the ability to lock and unlock all the doors of the car at once, either by clicking the key fob or pressing a button inside the car.",
      category: "Convenience"
    },
    {
      term: "Catalytic Converter",
      description: "Uses catalysts to reduce the amount of harmful exhaust gases by converting them into non-harmful ones.",
      category: "Engine"
    },
    {
      term: "Coefficient of drag (Cd)",
      description: "A figure which represents the aerodynamic efficiency of a car's shape. The lower the Cd, the less air resistance the car encounters as you drive.",
      category: "Performance"
    },
    {
      term: "Continuously Variable Transmission (CVT)",
      description: "A highly efficient transmission which has infinite gear ratios. It uses cones and pulleys to make continuous, seamless adjustments so that the ideal gear ratio is used at all times.",
      category: "Transmission"
    },
    {
      term: "Cruise Control",
      description: "A system that automatically assists to maintain the vehicle at a set, pre-determined speed. Mostly used for driving on open roads, it is easily disengaged by touching the brake pedal.",
      category: "Convenience"
    },
    {
      term: "Crumple Zones",
      description: "Parts of the car, designed to collapse during a collision in order to absorb crash energy and minimise impact on people in the car.",
      category: "Safety"
    },
    // D
    {
      term: "Digital Radio (DAB+)",
      description: "Digital Audio Broadcast (DAB+) benefits from more channels than conventional radio. Information such as station name and music track can also be shown on the audio system display.",
      category: "Entertainment"
    },
    {
      term: "Double Overhead Camshafts (DOHC)",
      description: "Double overhead cams (DOHC) operate the engine's valves in a precise and controlled way. This helps increase power and efficiency.",
      category: "Engine"
    },
    {
      term: "Downhill Assist Control (DAC)",
      description: "Electronically controlled system designed to help prevent the vehicle slipping sideways during steep off-road hill descents. It provides 'feet off' driving down a steep incline.",
      category: "Safety"
    },
    // E
    {
      term: "Electric Power-assisted Steering (EPS)",
      description: "System in which an electric motor attached to the steering rack or shaft provides power assistance - in place of the conventional hydraulic assist system. The electric motor only consumes energy when power assistance is required.",
      category: "Steering"
    },
    {
      term: "Electronic Brake Assistance (EBA)",
      description: "A system which senses when an emergency stop is in progress and, if necessary, adds brake force to stop the car as quickly as possible.",
      category: "Safety"
    },
    {
      term: "Electronic Brakeforce Distribution (EBD)",
      description: "A system that maximises braking efficiency. It senses the weight distribution of the vehicle and redistributes the braking to each wheel so that the wheels with most weight on them receive the most brake force.",
      category: "Safety"
    },
    {
      term: "Electronic Stability Programme (ESP)",
      description: "Also known as Vehicle Stability Control (VSC) this uses sensors to analyse cornering stability and selectively applies brake-force and engine power to each wheel.",
      category: "Safety"
    },
    // F
    {
      term: "Four Wheel Drive (4WD)",
      description: "Like All-Wheel Drive (AWD) 4WD delivers engine power to all four wheels, which is useful in off-road conditions. Because 4WD can be expensive on fuel, most 4WD vehicles also have a 2WD setting for normal road use.",
      category: "Drivetrain"
    },
    // H
    {
      term: "Head Up Display (HUD)",
      description: "A system that may project information such as vehicle speed onto the windscreen where it can be seen at a glance, enabling the driver to stay as focussed on the road as possible.",
      category: "Technology"
    },
    {
      term: "High Intensity Discharge (HID) Lights",
      description: "Use an electrical arc rather than a conventional glowing incandescent bulb. They create a daylight-like beam of light which is brighter, allowing you to see further.",
      category: "Lighting"
    },
    {
      term: "Hill-start Assist Control (HAC)",
      description: "Automatic function that prevents the vehicle rolling downhill when starting off. It is particularly helpful on low-traction surfaces and when driving off road.",
      category: "Safety"
    },
    {
      term: "Hybrid Synergy Drive (HSD)",
      description: "Integrates the desirable elements of a petrol engine and an electronic motor. It uses the instantaneous high torque from the electric motor from rest for starting, and utilises the efficient power of the petrol engine for cruising.",
      category: "Engine"
    },
    // L
    {
      term: "Light Emitting Diode (LED) Lights",
      description: "Are brighter, more energy efficient and last longer than conventional incandescent lights.",
      category: "Lighting"
    },
    {
      term: "Limited Slip Differential (LSD)",
      description: "A differential that limits the difference in rotation speed between the two wheels on the same axle to optimise traction. It prevents a wheel that has no grip from spinning excessively.",
      category: "Drivetrain"
    },
    // P
    {
      term: "Power assisted steering (PAS)",
      description: "Provides turning assistance, making heavier cars easier to steer, particularly at low speeds. Some automatic or electronically-controlled PAS systems vary the amount of assistance depending on speed.",
      category: "Steering"
    },
    // S
    {
      term: "Satellite Navigation (Sat Nav)",
      description: "A system which displays the location of the vehicle on a 'map' screen, and can be programmed to provide information such as directions to a destination both visually, and with spoken messages.",
      category: "Technology"
    },
    {
      term: "Smart Entry",
      description: "Also known as 'keyless entry', this is a wireless system, which recognises your key fob as you approach the car, even if it's in a bag or your pocket, and unlocks itself when you take hold of the door handle.",
      category: "Convenience"
    },
    {
      term: "Smart Start Button",
      description: "Smart Start (or Push Button Start) provides push-button engine start and stop. It operates when the fob is within range of the internal antennae.",
      category: "Convenience"
    },
    {
      term: "Sport Utility Vehicle (SUV)",
      description: "Typically wagons, often with off road capabilities and 4-wheel Drive or All-Wheel Drive technology.",
      category: "Vehicle Type"
    },
    // T
    {
      term: "Torque",
      description: "Describes the ability of a force to rotate something about an axis. In a car, it's a way of describing how effective engine power is at turning the axle and getting power you can use to the wheels.",
      category: "Performance"
    },
    {
      term: "Traction Control (TRC)",
      description: "System designed to maximise safety when accelerating on slippery road surfaces or when the available grip differs from one side of the vehicle to the other.",
      category: "Safety"
    },
    // V
    {
      term: "Variable Valve Timing with intelligence (VVT-i)",
      description: "Engine system that provides variations of the intake valve timing to provide optimal valve timing for the full range of driving conditions. It can improve driveability, performance, fuel efficiency and reduces emissions.",
      category: "Engine"
    },
    {
      term: "Vehicle Identification Number (VIN)",
      description: "A unique identifying code numbers given to every new vehicle. It is used by manufacturers, insurance companies and government agencies to identify individual vehicles.",
      category: "Identification"
    },
    {
      term: "Vehicle Stability Control (VSC)",
      description: "System that ensures control in cornering situations the way ABS does under braking and TRC does under acceleration. The VSC system utilises electronic sensors to help control any potential understeer or oversteer situations.",
      category: "Safety"
    },
    // W
    {
      term: "Whiplash Injury Lessening (WIL)",
      description: "WIL seats are designed to reduce the likelihood of whiplash injury to occupants in the event of a collision.",
      category: "Safety"
    },
    // Additional Toyota Glossary Terms
    {
      term: "Active Height Control (AHC)",
      description: "Allows the driver to vary the ride height to suit off-road driving (increased height) and ease of entry (decreased height).",
      category: "Suspension"
    },
    {
      term: "Active Traction Control (ATRC)",
      description: "This system dynamically distributes the torque to each wheel as well as regulates brake pressure, eliminating wheel-spin and ensuring that the tyres with the best grip always help the driver to keep the vehicle in motion.",
      category: "Safety"
    },
    {
      term: "Acoustic Glass Technology",
      description: "Some cars are fitted with acoustic glass windscreens. These are constructed from specially laminated materials, which help to considerably reduce noise inside the car.",
      category: "Comfort"
    },
    {
      term: "Adaptive Front Lighting System (AFS)",
      description: "Adaptive Front Lighting System (AFLS) changes the headlamp beam direction in response to steering movements, helping with better visibility at intersections or on bends.",
      category: "Lighting"
    },
    {
      term: "Advanced Variable Gear Ratio Steering (VGRS)",
      description: "Electronically powered system to provide increased steering assistance and a quicker steering gear ratio at low speeds, as well as optimum driving feel.",
      category: "Steering"
    },
    {
      term: "Advanced Audio Systems",
      description: "Car audio systems are becoming increasingly sophisticated. Some systems will play music from CDs, USB devices, MP3 players and music from Bluetooth enabled devices, and also play DivX video from USB devices.",
      category: "Entertainment"
    },
    {
      term: "Aerodynamics",
      description: "The aerodynamic performance of a car describes how well its shape cuts through the air. The more efficient the shape, the lower the co-efficient of drag (Cd) will be, helping reduce fuel consumption and enabling higher speeds.",
      category: "Performance"
    },
    {
      term: "Artificial Intelligence Shift Control (AI Shift Control)",
      description: "One of the modern Electronically Controlled Transmission (ECT) features, it provides the ability to 'read' the driver's intentions and to 'read' hills, managing the shift regime according to road conditions and driver behaviour.",
      category: "Transmission"
    },
    {
      term: "Audio Visual Navigation (AVN)",
      description: "Audio Visual Navigation unit (AVN) is a satellite navigation system using GPS to track your position and destination. It will mark out the best route with on-screen maps and spoken directions.",
      category: "Technology"
    },
    {
      term: "Dual-stage SRS airbags",
      description: "Dual-Stage (or Dual Deploy) technology airbags are 'smart' airbags that can inflate partially, completely or not at all, depending on the speed of impact or the weight of a vehicle occupant sitting in a seat.",
      category: "Safety"
    },
    {
      term: "Dual Variable Valve Timing with intelligence (Dual VVT-i)",
      description: "Dual VVT-i is an advanced form of VVTi. Where VVTi adjusts fuel intake timing to improve engine efficiency, Dual VVTi continuously adjusts both the exhaust valve timing and the fuel intake timing for even better fuel-efficiency and lower CO2 emissions.",
      category: "Engine"
    },
    {
      term: "Dual Exhaust (also known as Twin Exhausts)",
      description: "These systems take pressure off the engine as exhaust gases can be expelled with less effort. This enables the engine to put more power into driving the car.",
      category: "Engine"
    },
    {
      term: "Dynamic Radar Cruise Control",
      description: "Dynamic Radar Cruise Control is an advanced cruise control system that uses radar to detect when the vehicle is closing in on a slower vehicle in front. It then slows the car to maintain a safe gap and only accelerates back to the pre-set speed when the vehicle in front either speeds up or moves out of the way.",
      category: "Technology"
    },
    {
      term: "Electro Multi-Vision (EMV)",
      description: "Electro Multi-Vision screen (EMV) gives the driver control over many of the car's features. These may include the audio system and, where equipped, the DVD-based Satellite Navigation systems, hands-free phone and feeds from cameras.",
      category: "Technology"
    },
    {
      term: "Electro-chromatic Mirror",
      description: "An electro-chromatic rear view mirror automatically adjusts to reduce glare from headlights on cars that are following you at night.",
      category: "Convenience"
    },
    {
      term: "Electronic Continuously Variable Transmission System (e-CVT)",
      description: "Electronic Continuously Variable Transmission (e-CVT) is a highly efficient transmission system. The electronically controlled system makes continuous, seamless adjustments so that the ideal gear ratio is used at all times.",
      category: "Transmission"
    },
    {
      term: "Electronically Controlled Transmission (ECT)",
      description: "Electronic control of the automatic transmission has created a raft of breakthroughs in driving comfort and vehicle efficiency. ECT helps to ensure optimal gear change timing according to throttle position with vehicle load and judges the most suitable time to initiate torque converter for increased fuel economy.",
      category: "Transmission"
    },
    {
      term: "Emergency Brake Signal",
      description: "If the brakes are suddenly applied, the on-board computer engages the hazard lights (brake lights on some models) to rapidly flash. This helps draw the attention of the drivers behind which helps reduce the chance of a rear end collision.",
      category: "Safety"
    },
    {
      term: "Emergency Locking Retractor (ELR)",
      description: "Emergency Locking Retractor (ELR) seatbelts are sensitive to the motion of the vehicle and automatically lock on sudden stop or collision, helping to keep driver and passengers safe.",
      category: "Safety"
    },
    {
      term: "Energy Absorbing Steering Column",
      description: "Steering columns have special sections that can compress, to absorb impact energy in a frontal collision. Current designs include features to absorb the energy of a secondary impact.",
      category: "Safety"
    },
    {
      term: "Full Service History (FSH)",
      description: "A record of all the services the car has had, as well as repair invoices and other relevant documents.",
      category: "Maintenance"
    },
    {
      term: "Global Outstanding Assessment (GOA)",
      description: "Global Outstanding Assessment (GOA) is a stringent Toyota safety program. It incorporates extensive crash testing to help develop vehicles with safety features well above mandatory requirements.",
      category: "Safety"
    },
    {
      term: "Global Positioning System (GPS)",
      description: "Often used as another name for SatNav or satellite navigation. It uses information from orbiting satellites to calculate the position of your car and outline the route to where you want to go.",
      category: "Technology"
    },
    {
      term: "Head Impact Protection (HIP)",
      description: "A package of features designed to lessen the chance of head injury in an accident. Includes energy absorbing materials in the door trims, pillars, roof side-member, roof inner and roof side rails.",
      category: "Safety"
    },
    {
      term: "Independent Rear Suspension (IRS)",
      description: "IRS stands for Independent rear Suspension. Each rear wheel is mounted and able to move in isolation from the other wheel. This can improve handling and comfort in comparison to cars with rear wheels linked to a common axle.",
      category: "Suspension"
    },
    {
      term: "Intelligent Park Assist (IPA)",
      description: "Intelligent Parking Assist (IPA) is a system to automatically parallel or reverse park. All the driver has to do is monitor the car and manage the brake.",
      category: "Technology"
    },
    {
      term: "Liquid Crystal Displays (LCD)",
      description: "Liquid Crystal Displays (LCD) are versatile and easy to read displays. They have bright clear images to show many car functions.",
      category: "Technology"
    },
    {
      term: "MET paint",
      description: "Abbreviation of metallic paint. Metallic paint is also sometimes called polychromatic paint. The small metal flakes in the paint cause a sparkling effect and can accentuate the contours of a car's bodywork more than non-metallic, or 'solid' paint.",
      category: "Exterior"
    },
    {
      term: "MP3",
      description: "MP3 is a digital sound format often used for music. MP3 capable players in vehicles may play a huge variety of material from a number of media, including CDs and USB sticks.",
      category: "Entertainment"
    },
    {
      term: "MPa",
      description: "Stands for Mega Pascal, a unit of measurement of tensile strength. High tensile automotive steel is anything over 400MPa. The stronger the steel used in the construction of a car's frame, the less steel is required, which reduces weight and can help to improve fuel economy.",
      category: "Performance"
    },
    {
      term: "Minimal Intrusion Cabin System (MICS)",
      description: "Toyota's Minimal Intrusion Cabin System (MICS) technology effectively disperses the energy of frontal or side impacts through the body in order to divert it away from the passenger cell and minimise cabin deformation.",
      category: "Safety"
    },
    {
      term: "Noise, Vibration and Harshness (NVH)",
      description: "High levels of Noise, Vibration and Harshness (NVH) in a car can make driving stressful and tiring. New vehicles have multiple layers of sound insulation and sound barriers to help create a quiet, calm interior.",
      category: "Comfort"
    },
    {
      term: "Occupant Detection System (ODS)",
      description: "A feature of advanced airbag protection systems. In the event of an accident, if the system detects that no front passenger is on board, the airbag won't deploy. The system may also be able to detect the size and position of the passenger, meaning that the airbag can be deployed in a way that provides maximum protection.",
      category: "Safety"
    },
    {
      term: "Oversteer",
      description: "Oversteering describes when the rear wheels lose grip and the tail begins to slide, turning the car more than you want. If not corrected, oversteer can develop into a skid. ABS brakes and Traction Control systems are designed to help correct oversteer and understeer.",
      category: "Performance"
    },
    {
      term: "On Board Computer (OBC)",
      description: "With this, you can obtain estimated arrival times, fuel consumption, time to next service etc.",
      category: "Technology"
    },
    {
      term: "Paddle Shift Technology",
      description: "Some automatics are equipped with Paddle Shift Technology. This allows the driver to make sporty, manual-like gear changes, using 'paddle shifters' (small paddle shaped controls on the steering wheel).",
      category: "Transmission"
    },
    {
      term: "Park Assist",
      description: "Park Assist is a system using parking sensors to provide audible warnings as the driver gets close to an obstacle. The speed of audio beeps increases as you get closer to the obstacle.",
      category: "Technology"
    },
    {
      term: "Parking sensors",
      description: "These will detect obstacles, or the cars at the front or rear as you park, and alert you when you are getting close to them.",
      category: "Technology"
    },
    {
      term: "Rack & Pinion",
      description: "A rack and pinion is a type of linear actuator that comprises a pair of gears which convert rotational motion into linear motion. A circular gear called 'the pinion' engages teeth on a linear 'gear' bar called 'the rack'.",
      category: "Steering"
    },
    {
      term: "Reverse Camera",
      description: "Reverse Camera displays the area at the rear of the vehicle on a screen, when the vehicle is in reverse.",
      category: "Technology"
    },
    {
      term: "SUNA™ Traffic Channel",
      description: "SUNA™ Traffic Channel broadcasts real-time traffic information directly to compatible navigation systems, keeping you informed of adverse traffic conditions ahead and suggesting alternative routes to avoid congestion.",
      category: "Technology"
    },
    {
      term: "Safe-T-Cell",
      description: "Body design with crumple zones front and rear, and a high-integrity cabin section. The crumple zones are designed to progressively absorb impact energy. The cabin is designed to provide survival space for the occupants, including head and foot space.",
      category: "Safety"
    },
    {
      term: "Smart Entry",
      description: "Also known as 'keyless entry', this is a wireless system, which recognises your key fob (security token), as you approach the car, even if it's in a bag or your pocket, and unlocks itself when you take hold of the door handle.",
      category: "Convenience"
    },
    {
      term: "Smart Start Button",
      description: "Smart Start (or Push Button Start) provides push-button engine start and stop. It operates when the fob is within range of the internal antennae.",
      category: "Convenience"
    },
    {
      term: "Solar Ventilation System",
      description: "Solar Ventilation Systems uses roof solar panels to power fans, helping to keep the vehicle cool inside in hot weather. It can be operated using a remote control.",
      category: "Comfort"
    },
    {
      term: "Steering Wheel Controls",
      description: "These are buttons mounted on the steering wheel, which enable you to control some features of audio systems and hands-free mobile phone calls.",
      category: "Convenience"
    },
    {
      term: "Supplemental Restraint System (SRS)",
      description: "The Supplemental Restraint System (SRS) is composed of multiple systems within a vehicle such as airbags and seatbelt pretensioners, which help restrain the occupants in the event of a collision in turn helping to minimise the chance of injury.",
      category: "Safety"
    },
    {
      term: "Torque-Sensing Centre Differential",
      description: "A feature in the all-wheel drive system that automatically distributes power to the axles with the best traction.",
      category: "Drivetrain"
    },
    {
      term: "Touch Screen Display",
      description: "Some cars are fitted with a touch screen display that can control features in the car such as the sound system, air-conditioning and hands-free calls. In systems such as Toyota's TECH® entertainment hub, the touch screen also controls SatNav and displays 3D maps and DivX™ video.",
      category: "Technology"
    },
    {
      term: "Touch Tracer Technology",
      description: "Touch Tracer allows easy control of many of the vehicle's functions, such as air-con, audio system etc. Buttons on the steering wheel allow the driver to touch step through various options and then select one by pressing firmly, with that function then displayed directly in front of the driver.",
      category: "Technology"
    },
    {
      term: "Toyota Electronically Modulated Suspension (TEMS)",
      description: "A semi-active system to improve ride and handling and enhance driving dynamics both on and off road. TEMS allows the driver to select a suspension setting for optimum ride comfort and handling depending on the road surface and driving conditions.",
      category: "Suspension"
    },
    {
      term: "Toyota Entertainment Communications Hub (T.E.C.H.)™ System",
      description: "Toyota Entertainment Communications Hub (T.E.C.H.™) is an advanced suite of features based around a touch screen. It may include where applicable, Satellite Navigation with 3D graphics, Bluetooth™ music streaming, and DivX™ video and audio playback from a USB memory stick.",
      category: "Entertainment"
    },
    {
      term: "Toyota Link",
      description: "Connecting your vehicle to Toyota Link via compatible smartphone will give you access to a suite of applications to make your journey more enjoyable. Receive real-time advice with Fuel Finder, look up the local weather forecast or search for accommodation, restaurants and businesses in your area with Local Search.",
      category: "Technology"
    },
    {
      term: "Traction",
      description: "The more grip the tyres have the more traction the car has.",
      category: "Performance"
    },
    {
      term: "Understeer",
      description: "Like oversteer, this is a term used to describe the sensitivity of a vehicle to steering. Understeer occurs when a car steers less than, or 'under' the amount commanded or expected by the driver. ABS brakes and Traction Control systems are designed to help correct oversteer and understeer.",
      category: "Performance"
    },
    {
      term: "Used Car Safety Rating (UCSR)",
      description: "UCSR stands for Used Car Safety Rating. As with ANCAP, a 5 Star rating is the best. Before settling on a used car model it's worth checking its UCSR rating.",
      category: "Safety"
    },
    {
      term: "USB",
      description: "Stands for Universal Serial Bus. It is a commonly used digital connecting device. Many cars now have USB ports to allow you to play MP3 music files and DivX™ video.",
      category: "Technology"
    },
    {
      term: "Voice Control Technology",
      description: "Voice control technology uses speech recognition technology to enable the driver to control the audio system.",
      category: "Technology"
    },
    {
      term: "Windows Media Audio (WMA)",
      description: "Windows Media Audio (WMA) is an audio format commonly used on CDs.",
      category: "Entertainment"
    },
    // Auto Direct specific terms
    {
      term: "BSB (Bank State Branch)",
      description: "A six-digit number used to identify the individual branch of an Australian bank or financial institution.",
      category: "Financial"
    },
    {
      term: "Registration",
      description: "The legal process of recording a vehicle under a government authority to authorize its use on public roads.",
      category: "Legal"
    },
    {
      term: "Test Drive",
      description: "An opportunity for a potential buyer to drive a vehicle before making a purchase decision.",
      category: "Sales"
    },
    {
      term: "Dealer Locator",
      description: "A tool that allows customers to find nearby authorized car dealerships based on location.",
      category: "Sales"
    },
    {
      term: "Warranty",
      description: "A promise provided by the manufacturer or dealer to repair or replace a vehicle if necessary within a certain period after purchase.",
      category: "Legal"
    },
    {
      term: "Roadworthy Certificate (RWC)",
      description: "An official certificate issued after a vehicle inspection, stating the vehicle meets the minimum safety standards required by law.",
      category: "Legal"
    },
    {
      term: "Logbook Servicing",
      description: "Scheduled maintenance services performed on a vehicle according to the manufacturer's specifications to maintain warranty and vehicle health.",
      category: "Maintenance"
    },
    {
      term: "Stamp Duty",
      description: "A tax paid to the state government when registering a new or used vehicle, based on its market value or purchase price.",
      category: "Financial"
    },
    {
      term: "Trade-In",
      description: "When a buyer exchanges their current vehicle as part of the payment towards purchasing a new or used vehicle.",
      category: "Sales"
    },
  ];

  // Get unique categories
  const categories = ["All", ...new Set(glossaryItems.map(item => item.category))];

  const filteredItems = glossaryItems.filter((item) => {
    if (!searchTerm && selectedCategory === "All") {
      return true; // Show all items when no search term and all categories
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = searchLower === "" || 
                         item.term.toLowerCase().includes(searchLower) ||
                         item.description.toLowerCase().includes(searchLower);
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Sort by relevance: exact term matches first, then partial matches
    if (!searchTerm) return 0;
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    // Check for exact term match (highest priority)
    const aExactTerm = a.term.toLowerCase() === searchLower;
    const bExactTerm = b.term.toLowerCase() === searchLower;
    
    if (aExactTerm && !bExactTerm) return -1;
    if (!aExactTerm && bExactTerm) return 1;
    
    // Check for term starts with search (second priority)
    const aStartsWith = a.term.toLowerCase().startsWith(searchLower);
    const bStartsWith = b.term.toLowerCase().startsWith(searchLower);
    
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    
    // Check for term contains search (third priority)
    const aTermMatch = a.term.toLowerCase().includes(searchLower);
    const bTermMatch = b.term.toLowerCase().includes(searchLower);
    
    if (aTermMatch && !bTermMatch) return -1;
    if (!aTermMatch && bTermMatch) return 1;
    
    // If both match terms or both don't, sort alphabetically
    return a.term.localeCompare(b.term);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">Vehicle Glossary</h1>
          <p className="text-gray-600 text-lg">Comprehensive guide to automotive terms and technologies</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Search input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Search Terms
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search terms or descriptions..."
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Category filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all duration-200"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count and search info */}
          <div className="text-sm text-gray-600">
            Showing {filteredItems.length} of {glossaryItems.length} terms
            {searchTerm && (
              <span className="ml-2 text-black font-medium">
                for "{searchTerm}"
              </span>
            )}
            {selectedCategory !== "All" && (
              <span className="ml-2 text-black font-medium">
                in {selectedCategory}
              </span>
            )}
          </div>
        </div>

        {/* Glossary Terms */}
        <div className="space-y-6">
          {filteredItems.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-bold text-black">
                  {item.term}
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No matching terms found</h3>
              <p className="text-gray-500">Try adjusting your search terms or category filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlossaryPage;

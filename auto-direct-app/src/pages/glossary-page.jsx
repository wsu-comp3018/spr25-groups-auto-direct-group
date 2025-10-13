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
      description: "System developed to provide enhanced control and improved fuel economy. Toyota Active AWD is a compact system that controls torque distribution between the front and rear axles — using a newly developed electromagnetic coupling in the rear differential housing. Electronically controlled Active AWD system saves engine power and fuel by only driving the front wheels and switches automatically to all-wheel drive when needed.",
      category: "Drivetrain"
    },
    {
      term: "Active Braking with intelligence (AB-i)",
      description: "Active Braking with intelligence (AB-i) is a system designed to help stop quickly and safely in an emergency. The AB-i system uses continuous feedback from sensors in the wheels to ensure that brake force is applied as effectively as possible whatever the driving conditions.",
      category: "Safety"
    },
    {
      term: "Active Cruise Control (ACC)",
      description: "Also known as Radar Cruise Control, Intelligent Cruise Control and Adaptive Cruise Control, this system uses radar to maintain a safe distance between you and the vehicle in front. If the vehicle in front slows down, the system will register this and slow down too.",
      category: "Technology"
    },
    {
      term: "Active Height Control (AHC)",
      description: "Allows the driver to vary the ride height to suit off-road driving (increased height) and ease of entry (decreased height).",
      category: "Suspension"
    },
    {
      term: "Active Traction Control (ATRC)",
      description: "This system dynamically distributes the torque to each wheel as well as regulates brake pressure, eliminating wheel-spin and ensuring that the tyres with the best grip always help the driver to keep the vehicle in motion.",
      category: "Drivetrain"
    },
    {
      term: "Acoustic Glass Technology",
      description: "Some cars are fitted with acoustic glass windscreens constructed from specially laminated materials, which help to considerably reduce noise inside the car.",
      category: "Comfort"
    },
    {
      term: "Adaptive Front Lighting System (AFS)",
      description: "Adaptive Front Lighting System (AFLS) changes the headlamp beam direction in response to steering movements, helping with better visibility at intersections or on bends.",
      category: "Lighting"
    },
    {
      term: "Advanced Variable Gear Ratio Steering (VGRS)",
      description: "Electronically powered system to provide increased steering assistance and a quicker steering gear ratio at low speeds, as well as optimum driving feel. Also reduces understeer and enhanced steering adjustment when cornering.",
      category: "Steering"
    },
    {
      term: "Advanced Audio Systems",
      description: "Car audio systems are becoming increasingly sophisticated. Some systems will play music from CDs, USB devices, MP3 players and Bluetooth enabled devices. They'll also pair with modern mobile phones for hands-free calls.",
      category: "Technology"
    },
    {
      term: "Aerodynamics",
      description: "The aerodynamic performance of a car describes how well its shape cuts through the air. The more efficient the shape, the lower the co-efficient of drag (Cd) will be, helping reduce fuel consumption.",
      category: "Performance"
    },
    {
      term: "Airbags",
      description: "Designed to inflate and absorb impact energy to help protect vehicle occupants in the event of a collision. Dual-Stage technology are 'smart' airbags that can inflate partially, completely or not at all, depending on the speed of impact.",
      category: "Safety"
    },
    {
      term: "Air Conditioning",
      description: "Uses engine power to cool the air in a car's ventilation system. More advanced systems include multi-zone Climate Control air conditioning, which allows different areas of the car to be maintained at different temperatures.",
      category: "Comfort"
    },
    {
      term: "All Wheel Drive (AWD)",
      description: "An always-on 4 wheel drive system, which gives you more control on uneven and slippery surfaces.",
      category: "Drivetrain"
    },
    {
      term: "Anti-intrusion beams",
      description: "Beams placed in the side doors to protect the occupants in the event of a side impact to the vehicle.",
      category: "Safety"
    },
    {
      term: "Artificial Intelligence Shift Control (AI Shift Control)",
      description: "One of the modern Electronically Controlled Transmission (ECT) features, it provides the ability to 'read' the driver's intentions and 'read' hills. It's a transmission algorithm designed to manage the shift regime according to road conditions and driver behaviour.",
      category: "Transmission"
    },
    {
      term: "Automatic High Beam (AHB)",
      description: "Sometimes known as 'smart beam' or 'high beam assist', this technology detects the head and tail lights of vehicles on the road in front of you, and automatically dips your lights so as not to dazzle other drivers.",
      category: "Lighting"
    },
    {
      term: "Audio Visual Navigation (AVN)",
      description: "Audio Visual Navigation unit (AVN) is a satellite navigation system using GPS to track your position and destination. It will mark out the best route with on-screen maps and spoken directions.",
      category: "Technology"
    },

    // B
    {
      term: "Blind Spot Monitor (BSM)",
      description: "Uses radar to monitor the car's blind spots. It indicates if there is another vehicle hidden by a blind spot and creates a warning indication in the appropriate side mirror.",
      category: "Safety"
    },
    {
      term: "Bluetooth",
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
      description: "Central Locking gives you the ability to lock and unlock all the doors of the car at once, either by clicking the key fob or pressing a button inside the car.",
      category: "Security"
    },
    {
      term: "Catalytic Converter",
      description: "These use catalysts to reduce the amount of harmful exhaust gases by converting them into non-harmful ones.",
      category: "Engine"
    },
    {
      term: "Coefficient of drag (Cd)",
      description: "This is a figure which represents the aerodynamic efficiency of a car's shape. The lower the Cd, the less air resistance the car encounters as you drive.",
      category: "Performance"
    },
    {
      term: "Continuously Variable Transmission (CVT)",
      description: "Continuously Variable Transmission (CVT) is a highly efficient transmission which has infinite gear ratios. It makes continuous, seamless adjustments so that the ideal gear ratio is used at all times for a smoother drive.",
      category: "Transmission"
    },
    {
      term: "Cruise Control",
      description: "Cruise Control is a system that automatically assists to maintain the vehicle at a set, pre-determined speed. Mostly used for driving on open roads, it is easily disengaged by touching the brake pedal.",
      category: "Technology"
    },
    {
      term: "Crumple Zones",
      description: "Crumple Zones are parts of the car, designed to collapse during a collision in order to absorb crash energy and minimise impact on people in the car.",
      category: "Safety"
    },

    // D
    {
      term: "Digital Radio (DAB+)",
      description: "Digital Audio Broadcast (DAB+) benefits from more channels than conventional radio. Information such as station name and music track can also be shown on the audio system display.",
      category: "Technology"
    },
    {
      term: "DivX",
      description: "DivX is a video format that allows you to watch pre-recorded video from a USB memory stick. This product supports the DivX format which can only be used when the vehicle is stationary.",
      category: "Technology"
    },
    {
      term: "Double Overhead Camshafts (DOHC)",
      description: "Double overhead cams (DOHC) operate the engine's valves in a precise and controlled way. This helps increase power and efficiency.",
      category: "Engine"
    },
    {
      term: "Downhill Assist Control (DAC)",
      description: "Electronically controlled system designed to help prevent the vehicle slipping sideways during steep off-road hill descents. It provides 'feet off' driving down a steep incline.",
      category: "Drivetrain"
    },
    {
      term: "Driver Assist Technology (DAT)",
      description: "Driver Assist Technology (DAT) encapsulates Toyota's 4WD technology - effectively doing the thinking for you. This technology is designed to suit on and off-road applications with multiple safety and control features.",
      category: "Technology"
    },
    {
      term: "Dual-stage SRS airbags",
      description: "Dual-Stage (or Dual Deploy) technology airbags are 'smart' airbags that can inflate partially, completely or not at all, depending on the speed of impact or the weight of a vehicle occupant sitting in a seat.",
      category: "Safety"
    },
    {
      term: "Dual Variable Valve Timing with智慧 (Dual VVT-i)",
      description: "Dual VVT-i is an advanced form of VVTi. It continuously adjusts both the exhaust valve timing and the fuel intake timing for better fuel-efficiency and lower CO2 emissions.",
      category: "Engine"
    },
    {
      term: "Dual Exhaust",
      description: "Also known as Twin Exhausts, these systems take pressure off the engine as exhaust gases can be expelled with less effort, enabling the engine to put more power into driving the car.",
      category: "Exhaust"
    },
    {
      term: "Dynamic Radar Cruise Control",
      description: "An advanced cruise control system that uses radar to detect when the vehicle is closing in on a slower vehicle in front. It then slows the car to maintain a safe gap and only accelerates back to the pre-set speed when the vehicle in front either speeds up or moves out of the way.",
      category: "Technology"
    },

    // E
    {
      term: "Electric Power-assisted Steering (EPS)",
      description: "System in which an electric motor attached to the steering rack or shaft provides power assistance in place of the conventional hydraulic assist system. The electric motor only consumes energy when power assistance is required, thereby saving fuel.",
      category: "Steering"
    },
    {
      term: "Electro Multi-Vision (EMV)",
      description: "Electro Multi-Vision screen (EMV) gives the driver control over many of the car's features including audio system, Satellite Navigation systems, hands-free phone and feeds from cameras.",
      category: "Technology"
    },
    {
      term: "Electro-chromatic Mirror",
      description: "An electro-chromatic rear view mirror automatically adjusts to reduce glare from headlights on cars that are following you at night.",
      category: "Visibility"
    },
    {
      term: "Electronic Brake Assistance (EBA)",
      description: "A system which senses when an emergency stop is in progress and, if necessary, adds brake force to stop the car as quickly as possible.",
      category: "Safety"
    },
    {
      term: "Electronic Brakeforce Distribution (EBD)",
      description: "Electronic Brake-force Distribution (EBD) is a system that maximises braking efficiency. It senses the weight distribution of from vehicle and redistributes the braking to each wheel so that the wheels with most weight on them receive the most brake force.",
      category: "Safety"
    },
    {
      term: "Electronic Climate Control",
      description: "Also known as automatic climate control air-conditioning, this automatically maintains a pre-set temperature within the car. More advanced systems may be dual-zone or multi-zone.",
      category: "Comfort"
    },
    {
      term: "Electronic Continuously Variable Transmission System (e-CVT)",
      description: "Electronic Continuously Variable Transmission (e-CVT) is a highly efficient transmission system. The electronically controlled system makes continuous, seamless adjustments so that the ideal gear ratio is used at all times.",
      category: "Transmission"
    },
    {
      term: "Electronically Controlled Transmission (ECT)",
      description: "Electronic control of the automatic transmission has created breakthroughs in driving comfort and vehicle efficiency. ECT helps to ensure optimal gear change timing according to throttle position with vehicle load.",
      category: "Transmission"
    },
    {
      term: "Electronic Stability Programme (ESP)",
      description: "Also known as Vehicle Stability Control (VSC) this uses sensors to analyse cornering stability and selectively applies brake-force and engine power to each wheel to help keep the car going where the driver wants it to go.",
      category: "Safety"
    },
    {
      term: "Emergency Brake Signal",
      description: "If the brakes are suddenly applied, the on-board computer engages the hazard lights to rapidly flash. This helps draw the attention of the drivers behind which helps reduce the chance of a rear end collision.",
      category: "Safety"
    },
    {
      term: "Emergency Locking Retractor (ELR)",
      description: "Emergency Locking Retractor (ELR) seatbelts are sensitive to the motion of the vehicle and automatically lock on sudden stop or collision, helping to keep driver and passengers safe.",
      category: "Safety"
    },
    {
      term: "Energy Absorbing Steering Column",
      description: "Steering columns have special sections that can compress, to absorb impact energy in a frontal collision, including features to absorb the energy of a secondary impact.",
      category: "Safety"
    },

    // F
    {
      term: "Full Service History (FSH)",
      description: "A record of all the services the car has had, as well as repair invoices and other relevant documents.",
      category: "Maintenance"
    },
    {
      term: "Four Wheel Drive (4WD)",
      description: "Like All-Wheel Drive (AWD) 4WD delivers engine power to all four wheels, which is useful in off-road conditions. Most 4WD vehicles also have a 2WD setting for normal road use.",
      category: "Drivetrain"
    },

    // G
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

    // H
    {
      term: "Head Impact Protection (HIP)",
      description: "A package of features designed to lessen the chance of head injury in an accident. Includes energy absorbing materials in the door trims, pillars, roof side-member, roof inner and roof side rails.",
      category: "Safety"
    },
    {
      term: "Head Up Display (HUD)",
      description: "Head Up Display (HUD) is a system that may project information such as vehicle speed onto the windscreen where it can be seen at a glance, enabling the driver to stay as focused on the road as possible.",
      category: "Display"
    },
    {
      term: "High Intensity Discharge (HID) Lights",
      description: "High Intensity Discharge (HID) lights use an electrical arc rather than a conventional glowing incandescent bulb. They create a daylight-like beam of light which is brighter, allowing you to see further.",
      category: "Lighting"
    },
    {
      term: "Hill-start Assist Control (HAC)",
      description: "Automatic function that prevents the vehicle rolling downhill when starting off. It is particularly helpful on low-traction surfaces and when driving off road.",
      category: "Drivetrain"
    },
    {
      term: "Hybrid Synergy Drive (HSD)",
      description: "The Hybrid Synergy Drive integrates the elements of a petrol engine and an electronic motor. It uses the instantaneous high torque from the electric motor from rest for starting, and utilises the efficient power of the petrol engine for cruising.",
      category: "Hybrid"
    },

    // I
    {
      term: "Independent Rear Suspension (IRS)",
      description: "Independent rear Suspension. Each rear wheel is mounted and able to move in isolation from the other wheel. This can improve handling and comfort in comparison to cars with rear wheels linked to a common axle.",
      category: "Suspension"
    },
    {
      term: "Intelligent Park Assist (IPA)",
      description: "Intelligent Parking Assist (IPA) is a system to automatically parallel or reverse park. All the driver has to do is monitor the car and manage the brake.",
      category: "Technology"
    },

    // L
    {
      term: "Light Emitting Diode (LED) Lights",
      description: "Light Emitting Diode (LED) lights are brighter, more energy efficient and last longer than conventional incandescent lights.",
      category: "Lighting"
    },
    {
      term: "Limited Slip Differential (LSD)",
      description: "A differential that limits the difference in rotation speed between the two wheels on the same axle to optimise traction. It prevents a wheel that has no grip from spinning excessively.",
      category: "Transmission"
    },
    {
      term: "Liquid Crystal Displays (LCD)",
      description: "Liquid Crystal Displays (LCD) are versatile and easy to read displays. They have bright clear images to show many car functions.",
      category: "Display"
    },

    // M
    {
      term: "MET paint",
      description: "Abbreviation of metallic paint. Metallic paint is also sometimes called polychromatic paint. The small metal flakes in the paint cause a sparkling effect and can accentuate the contours of a car's bodywork.",
      category: "Paint"
    },
    {
      term: "MP3",
      description: "MP3 is a digital sound format often used for music. MP3 capable players in vehicles may play a huge variety of material from a number of media, including CDs and USB sticks.",
      category: "Technology"
    },
    {
      term: "MPa",
      description: "Stands for Mega Pascal, a unit of measurement of tensile strength. High tensile automotive steel is anything over 400MPa. The stronger the steel used in the construction of a car's frame, the less steel is required.",
      category: "Materials"
    },
    {
      term: "Minimal Intrusion Cabin System (MICS)",
      description: "Toyota's Minimal Intrusion Cabin System (MICS) technology effectively disperses the energy of frontal or side impacts through the body in order to divert it away from the passenger cell and minimise cabin deformation.",
      category: "Safety"
    },

    // N
    {
      term: "Noise, Vibration and Harshness (NVH)",
      description: "High levels of Noise, Vibration and Harshness (NVH) in a car can make driving stressful and tiring. Modern vehicles have multiple layers of sound insulation and sound barriers to help create a quiet, calm interior.",
      category: "Comfort"
    },

    // O
    {
      term: "Occupant Detection System (ODS)",
      description: "A feature of advanced airbag protection systems. In the event of an accident, if the system detects that no front passenger is on board, the airbag won't deploy. The system may also detect the size and position of the passenger.",
      category: "Safety"
    },
    {
      term: "Oversteer",
      description: "Oversteering describes when the rear wheels lose grip and the tail begins to slide, turning the car more than you want. ABS brakes and Traction Control systems are designed to help correct oversteer and understeer.",
      category: "Handling"
    },
    {
      term: "On Board Computer (OBC)",
      description: "With this, you can obtain estimated arrival times, fuel consumption, time to next service etc.",
      category: "Technology"
    },

    // P
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
      term: "Power assisted steering (PAS)",
      description: "This provides turning assistance, making heavier cars easier to steer, particularly at low speeds. Some systems vary the amount of assistance depending on speed.",
      category: "Steering"
    },

    // R
    {
      term: "Rack & Pinion",
      description: "A rack and pinion is a type of linear actuator that comprises a pair of gears which convert rotational motion into linear motion. A circular gear called 'the pinion' engages teeth on a linear 'gear' bar called 'the rack'.",
      category: "Steering"
    },
    {
      term: "Reverse Camera",
      description: "Reverse Camera displays the area at the rear of the vehicle on a screen, when the vehicle is in reverse.",
      category: "Visibility"
    },

    // S
    {
      term: "SUNA™ Traffic Channel",
      description: "SUNA™ Traffic Channel broadcasts real-time traffic information directly to compatible navigation systems, keeping you informed of adverse traffic conditions ahead and suggesting alternative routes to avoid congestion.",
      category: "Technology"
    },
    {
      term: "Safe-T-Cell",
      description: "Toyota's body design with crumple zones front and rear, and a high-integrity cabin section. The crumple zones are designed to progressively absorb impact energy. The cabin provides survival space for the occupants.",
      category: "Safety"
    },
    {
      term: "Satellite Navigation (Sat Nav)",
      description: "Sat Nav is a system which displays the location of the vehicle on a 'map' screen, and can be programmed to provide information such as directions to a destination both visually, and with spoken messages.",
      category: "Technology"
    },
    {
      term: "Smart Entry",
      description: "Also known as 'keyless entry', this is a wireless system, which recognises your key fob as you approach the car, and unlocks itself when you take hold of the door handle.",
      category: "Security"
    },
    {
      term: "Smart Start Button",
      description: "Smart Start provides push-button engine start and stop. It operates when the fob is within range of the internal antennae.",
      category: "Security"
    },
    {
      term: "Solar Ventilation System",
      description: "Solar Ventilation Systems uses roof solar panels to power fans, helping to keep the vehicle cool inside in hot weather. It can be operated using a remote control.",
      category: "Comfort"
    },
    {
      term: "Sport Utility Vehicle (SUV)",
      description: "Typically wagons, often with off road capabilities and 4-wheel Drive or All-Wheel Drive technology.",
    category: "Vehicle Types"
    },
    {
      term: "Steering Wheel Controls",
      description: "These are buttons mounted on the steering wheel, which enable you to control some features of audio systems and hands-free mobile phone calls.",
      category: "Technology"
    },
    {
      term: "Supplemental Restraint System (SRS)",
      description: "The Supplemental Restraint System (SRS) is composed of multiple systems within a vehicle such as airbags and seatbelt pretensioners, which help restrain the occupants in the event of a collision.",
      category: "Safety"
    },

    // T
    {
      term: "Torque",
      description: "This describes the ability of a force to rotate something about an axis. In a car, it's a way of describing how effective engine power is at turning the axle and getting power to the wheels.",
      category: "Performance"
    },
    {
      term: "Torque-Sensing Centre Differential",
      description: "A feature in the all-wheel drive system that automatically distributes power to the axles with the best traction.",
      category: "Drivetrain"
    },
    {
      term: "Touch Screen Display",
      description: "Some cars are fitted with a touch screen display that can control features in the car such as the sound system, air-conditioning and hands-free calls.",
      category: "Display"
    },
    {
      term: "Touch Tracer Technology",
      description: "Touch Tracer allows easy control of many of the vehicle's functions, such as air-con, audio system etc. Buttons on the steering wheel allow the driver to touch step through various options and select one by pressing firmly.",
      category: "Technology"
    },
    {
      term: "Toyota Electronically Modulated Suspension (TEMS)",
      description: "A semi-active system to improve ride and handling and enhance driving dynamics both on and off road. TEMS allows the driver to select a suspension setting for optimum ride comfort and handling depending on the road surface.",
      category: "Suspension"
    },
    {
      term: "Toyota Entertainment Communications Hub (T.E.C.H.)",
      description: "Toyota Entertainment Communications Hub (T.E.C.H.) is an advanced suite of features based around a touch screen. It may include Satellite Navigation with 3D graphics, Bluetooth music streaming, and DivX video and audio playback from a USB stick.",
      category: "Technology"
    },
    {
      term: "Toyota Link",
      description: "Connecting your vehicle to Toyota Link via compatible smartphone gives you access to a suite of applications to make your journey more enjoyable, including Fuel Finder, weather forecast and Local Search.",
      category: "Technology"
    },
    {
      term: "Traction",
      description: "The more grip the tyres have the more traction the car has.",
      category: "Performance"
    },
    {
      term: "Traction Control (TRC)",
      description: "System designed to maximise safety when accelerating on slippery road surfaces. Operated by controlling the throttle and/or applying the brakes to qualquer wheel that is slipping.",
      category: "Safety"
    },

    // U
    {
      term: "Understeer",
      description: "This is a term used to describe the sensitivity of a vehicle to steering. Understeer occurs when a car steers less than, or 'under' the amount commanded or expected by the driver.",
      category: "Handling"
    },
    {
      term: "Used Car Safety Rating (UCSR)",
      description: "UCSR stands for Used Car Safety Rating. As with ANCAP, a 5 Star rating is the best. Worth checking a used car model's UCSR rating before purchasing.",
      category: "Safety"
    },
    {
      term: "USB",
      description: "Stands for Universal Serial Bus. It is a commonly used digital connecting device. Many cars now have USB ports to allow you to play MP3 music files and DivX video.",
      category: "Technology"
    },

    // V
    {
      term: "Variable Valve Timing with intelligence (VVT-i)",
      description: "Engine system that provides variations of the intake valve timing to provide optimal valve timing for the full range of driving conditions. It can improve driveability, performance, fuel efficiency and reduces emissions.",
      category: "Engine"
    },
    {
      term: "Vehicle Batch Number",
      description: "Your vehicle's batch number may be found on the Retail Delivery Record. This could possibly be stored in your vehicle's Service & Warranty Booklet.",
      category: "Documentation"
    },
    {
      term: "Vehicle Identification Number (VIN)",
      description: "This is a unique identifying code numbers given to every new vehicle. It is used by manufacturers, insurance companies and government agencies to identify individual vehicles.",
      category: "Documentation"
    },
    {
      term: "Vehicle Stability Control (VSC)",
      description: "System that ensures control in cornering situations. The VSC system utilises electronic sensors in conjunction with the ABS and TRC hardware to help control any potential understeer or oversteer situations.",
      category: "Safety"
    },
    {
      term: "Voice Control Technology",
      description: "Voice control technology uses speech recognition technology to enable the driver to control the audio system.",
      category: "Technology"
    },

    // W
    {
      term: "Whiplash Injury Lessening",
      description: "Whiplash Injury Lessening (WIL) seats are designed to reduce the likelihood of whiplash injury to occupants in the event of a collision.",
      category: "Safety"
    },
    {
      term: "Windows Media Audio (WMA)",
      description: "Windows Media Audio (WMA) is an audio format commonly used on CDs.",
      category: "Technology"
    }
  ];

  // Categories for filtering
  const categories = ["All", "Engine", "Safety", "Technology", "Drivetrain", "Comfort", "Transmission", "Performance", "Suspension", "Lighting", "Steering", "Visibility", "Security", "Hybrid", "Display", "Exhaust", "Materials", "Paint", "Handling", "Maintenance", "Documentation", "Vehicle Types"];

  // Filter glossary items based on search term and category
  const filteredItems = glossaryItems.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group filtered items by first letter
  const groupedItems = filteredItems.reduce((acc, item) => {
    const firstLetter = item.term.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {});

  // Sort the letters
  const sortedLetters = Object.keys(groupedItems).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C18.832 18.477 17.247 18 15.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Automotive Glossary
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Comprehensive automotive reference covering technologies, safety features, and systems from A to Z. Discover the terminology that defines modern automotive innovation.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Search */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Search Term
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search automotive terms..."
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Filter by Category
              </label>
              <select
                className="block w-full px-4 py-4 border border-gray-200 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Category Pills */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {categories.filter(cat => cat !== "All").slice(0, 10).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-black text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                  }`}
                >
                  {category}
                </button>
              ))}
              {categories.length > 11 && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedCategory === "All"
                      ? 'bg-black text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                  }`}
                >
                  All Categories
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          {filteredItems.length > 0 ? (
            <div className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl">
              <p className="text-sm font-medium">
                {searchTerm && `Found ${filteredItems.length} terms matching "${searchTerm}"`}
                {selectedCategory !== "All" && !searchTerm && `Showing ${filteredItems.length} terms in ${selectedCategory}`}
                {!searchTerm && selectedCategory === "All" && `Showing all ${filteredItems.length} automotive terms`}
              </p>
            </div>
          ) : null}
        </div>

        {/* Glossary Items */}
        <div className="space-y-8">
          {sortedLetters.map(letter => (
            <div key={letter} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
                <div className="flex items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{letter}</h2>
                    <p className="text-gray-300 text-sm">{groupedItems[letter].length} terms</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="space-y-6">
                  {groupedItems[letter].map((item, index) => (
                    <div key={index} className="group hover:bg-gray-50 p-6 rounded-xl transition-all duration-200 border-l-4 border-gray-200 hover:border-black">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-black transition-colors">
                            {item.term}
                          </h3>
                          <p className="text-gray-700 leading-relaxed text-base">
                            {item.description}
                          </p>
                        </div>
                        <div className="ml-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 group-hover:bg-black group-hover:text-white transition-all duration-200">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="text-gray-400 mb-6">
              <svg className="mx-auto h-16 w-16" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No terms found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search term or selecting a different category. We have over 120 automotive terms spanning A to W.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-gray-100 to-white px-8 py-4 rounded-xl shadow-lg">
            <p className="text-gray-600 text-sm font-medium">
              Comprehensive automotive glossary • 120+ terms • Technologies A to W
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlossaryPage;

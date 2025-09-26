import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Download } from 'lucide-react';
import { motion, easeOut } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ERouterPaths } from '@/constants/enum';

const EventSchedule = () => {
    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState(1);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Main event categories - General Events moved to top
    const eventCategories = [
        'General Events',
        'Data Quest',
        'Tech Triathlon',
        'Math Mania',
        'Breach Point',
        'Game Over',
        'Survivor\'s Court',
        'Q-Factor'
    ];

    const day1Schedule = [
        { time: '9:00', endTime: '10:00', event: 'INAUGURAL', fullName: 'Inaugural Ceremony', location: 'F BLOCK ASSEMBLY HALL', type: 'ceremony', duration: "1 Hour", category: 'General Events' },
        { time: '10:00', endTime: '10:45', event: 'DQ (R1)', fullName: 'Data Quest Round 1', location: 'SIL,OSL,IIL,NSL', type: 'competition', duration: "45 minutes", category: 'Data Quest' },
        { time: '11:00', endTime: '13:00', event: 'TT (R1)', fullName: 'Tech Triathlon Round 1', location: 'CSL 1,CSL 2,CSL 3', type: 'competition', duration: "2 Hours", category: 'Tech Triathlon' },
        { time: '11:00', endTime: '13:00', event: 'DQ (R2)', fullName: 'Data Quest Round 2', location: 'SIL,OSL', type: 'competition', duration: "2 Hours", category: 'Data Quest' },
        { time: '11:00', endTime: '17:00', event: 'BP(R1)', fullName: 'Breach Point Round 1', location: 'J510,J511,J512,J513', type: 'competition', duration: "6 Hours", category: 'Breach Point' },
        { time: '10:00', endTime: '11:00', event: 'QF (R1)', fullName: 'Q-Factor Round 1', location: 'D BLOCK GROUND FLOOR', type: 'competition', duration: "1 Hour", category: 'Q-Factor' },
        { time: '13:00', endTime: '14:00', event: 'LUNCH BREAK', fullName: 'Lunch Break', location: 'CANTEEN', type: 'break', duration: "1 Hour", category: 'General Events' },
        { time: '11:15', endTime: '12:00', event: 'QF (R2)', fullName: 'Q-Factor Round 2', location: 'D BLOCK GROUND FLOOR', type: 'competition', duration: "45 minutes", category: 'Q-Factor' },
        { time: '12:15', endTime: '13:00', event: 'QF FINAL', fullName: 'Q-Factor Championship', location: 'D BLOCK GROUND FLOOR', type: 'final', duration: "45 minutes", category: 'Q-Factor' },
        { time: '14:00', endTime: '17:00', event: 'TT (R2)', fullName: 'Tech Triathlon Round 2', location: 'CSL 1,CSL 2,CSL 3,DSL', type: 'competition', duration: "3 Hours", category: 'Tech Triathlon' },
        { time: '14:00', endTime: '14:30', event: 'SC(R1)', fullName: 'Survivor\'s Court Round 1', location: 'M503,M504', type: 'competition', duration: "30 minutes", category: 'Survivor\'s Court' },
        { time: '14:00', endTime: '16:00', event: 'MM (R2)', fullName: 'Math Mania Round 2', location: 'J508', type: 'competition', duration: "2 Hours", category: 'Math Mania' },
        { time: '10:00', endTime: '16:30', event: 'GO (R1)', fullName: 'Game Over Round 1', location: 'Open Bay', type: 'competition', duration: "6 Hours 30 minutes", category: 'Game Over' },
        { time: '12:00', endTime: '13:00', event: 'MM (R1)', fullName: 'Math Mania Round 1', location: 'M503,M504', type: 'competition', duration: "1 Hour", category: 'Math Mania' },
        { time: '15:00', endTime: '17:00', event: 'SC(R2)', fullName: 'Survivor\'s Court Round 2', location: 'M503', type: 'competition', duration: "2 Hours", category: 'Survivor\'s Court' },
        { time: '17:00', endTime: '20:00', event: 'ENTERTAINMENT', fullName: 'Entertainment Program', location: 'QUADRANGLE', type: 'entertainment', duration: "3 Hours", category: 'General Events' }
    ];

    const day2Schedule = [
        { time: '8:30', endTime: '13:00', event: 'DQ (FINAL)', fullName: 'Data Quest Final', location: 'SIL', type: 'final', duration: "4 Hours 30 minutes", category: 'Data Quest' },
        { time: '8:30', endTime: '11:30', event: 'TT (FINAL)', fullName: 'Tech Triathlon Final', location: 'F202', type: 'final', duration: "3 Hours", category: 'Tech Triathlon' },
        { time: '8:30', endTime: '12:30', event: 'BP (FINAL)', fullName: 'Breach Point Final', location: 'SCL', type: 'final', duration: "4 Hours", category: 'Breach Point' },
        { time: '8:30', endTime: '12:30', event: 'GO (FINAL)', fullName: 'Game Over Final', location: 'OPEN BAY', type: 'final', duration: "4 Hours", category: 'Game Over' },
        { time: '13:00', endTime: '15:30', event: 'SC (FINAL)', fullName: 'Survivor\'s Court Final', location: 'D BLOCK GROUND', type: 'final', duration: "2 Hours 30 minutes", category: 'Survivor\'s Court' },
        { time: '13:00', endTime: '15:30', event: 'MM (FINAL)', fullName: 'Math Mania Final', location: 'M503', type: 'final', duration: "2 Hours 30 minutes", category: 'Math Mania' },
        { time: '16:30', endTime: '17:30', event: 'VALEDICTORY', fullName: 'Valedictory Ceremony', location: 'F BLOCK ASSEMBLY HALL', type: 'ceremony', duration: "1 Hour", category: 'General Events' }
    ];

    const currentSchedule = selectedDay === 1 ? day1Schedule : day2Schedule;

    // Convert time string to minutes since midnight
    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Generate hourly time slots
    const generateHourlyTimeSlots = (schedule) => {
        const times = [];
        schedule.forEach(event => {
            times.push(timeToMinutes(event.time), timeToMinutes(event.endTime));
        });

        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        const startHour = Math.floor(minTime / 60);
        const endHour = Math.ceil(maxTime / 60);

        const slots = [];
        for (let hour = startHour; hour <= endHour; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }

        return slots;
    };

    const timeSlots = generateHourlyTimeSlots(currentSchedule);

    // Updated color scheme - each category gets a different color
    const getCategoryColor = (category) => {
        switch (category) {
            case 'General Events': return 'bg-gradient-to-r from-purple-500 to-purple-600';
            case 'Data Quest': return 'bg-gradient-to-r from-blue-500 to-blue-600';
            case 'Tech Triathlon': return 'bg-gradient-to-r from-green-500 to-green-600';
            case 'Math Mania': return 'bg-gradient-to-r from-orange-500 to-orange-600';
            case 'Breach Point': return 'bg-gradient-to-r from-red-500 to-red-600';
            case 'Game Over': return 'bg-gradient-to-r from-pink-500 to-pink-600';
            case 'Survivor\'s Court': return 'bg-gradient-to-r from-teal-500 to-teal-600';
            case 'Q-Factor': return 'bg-gradient-to-r from-indigo-500 to-indigo-600';
            default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
        }
    };

    const getTimePosition = (time) => {
        const eventMinutes = timeToMinutes(time);
        const startMinutes = timeToMinutes(timeSlots[0]);
        const diffMinutes = eventMinutes - startMinutes;
        return (diffMinutes / 60) * 120; // 120px per hour
    };

    const getDurationWidth = (startTime, endTime) => {
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);
        const durationMinutes = endMinutes - startMinutes;
        return Math.max((durationMinutes / 60) * 120, 80); // Minimum 80px width, 120px per hour
    };

    const getCategoryPosition = (category) => {
        return eventCategories.indexOf(category) * 70; // 70px per category lane
    };

    const handleEventClick = (event) => {
        if (windowWidth < 768) {
            setSelectedEvent(event);
            setShowEventDetails(true);
        }
    };

    const handleMouseEnter = (event, e) => {
        if (windowWidth >= 768) {
            setHoveredEvent(event);
            setMousePosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e) => {
        if (hoveredEvent && windowWidth >= 768) {
            setMousePosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseLeave = () => {
        if (windowWidth >= 768) {
            setHoveredEvent(null);
        }
    };

    const reset = () => {
        setShowEventDetails(false);
        setSelectedEvent(null);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/EVENT.pdf'; // Path to your PDF in the public folder
        link.download = 'EVENT.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const EventDetailsModal = ({ event }) => (
        <motion.div
            className="lg:w-1/2 lg:p-0 w-full overflow-auto scrollbar h-full bg-[#1F102D] p-4"
            animate={{ x: 0, y: 0 }}
            initial={{ x: -50, y: 50 }}
            transition={{ ease: easeOut, duration: 0.5 }}
        >
            <div className="bg-[#311A49] rounded-xl p-6 border border-[#5F59598A]">
                <div className={`w-full h-2 ${getCategoryColor(event.category)} rounded-full mb-4`}></div>
                <h2 className="text-2xl font-bold text-white mb-4">{event.fullName}</h2>
                <div className="space-y-3 text-gray-300">
                    <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-3" />
                        <span>{event.time} - {event.endTime}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 mr-3" />
                            <span>{event.location}</span>
                        </div>
                    )}
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-3" />
                        <span>Duration: {event.duration} minutes</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="w-5 h-5 mr-3" />
                        <span>Category: {event.category}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="w-5 h-5 mr-3" />
                        <span>Type: {event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <main className="h-full w-full flex justify-between flex-col bg-[#171717]">
            <style jsx>{`
                .scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }
                .scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 2px;
                }
                .scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.5);
                }
            `}</style>

            {/* Hover Overlay */}
            {hoveredEvent && windowWidth >= 768 && (
                <div
                    className="fixed z-50 pointer-events-none bg-[#1F102D] border-2 border-[#5F5959] rounded-xl p-4 shadow-2xl max-w-sm w-72"
                    style={{
                        left: mousePosition.x + 15,
                        top: mousePosition.y - 10,
                        transform: mousePosition.x > window.innerWidth - 300 ? 'translateX(-100%) translateX(-15px)' : 'none'
                    }}
                >
                    <div className={`w-full h-2 ${getCategoryColor(hoveredEvent.category)} rounded-full mb-3`}></div>
                    <h3 className="text-lg font-bold text-white mb-3">{hoveredEvent.fullName}</h3>
                    <div className="space-y-2 text-gray-300">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-blue-400" />
                            <span className="text-xs">{hoveredEvent.time} - {hoveredEvent.endTime}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-green-400" />
                            <span className="text-xs">{hoveredEvent.location}</span>
                        </div>
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-purple-400" />
                            <span className="text-xs">{hoveredEvent.category}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-orange-400" />
                            <span className="text-xs">{hoveredEvent.type.charAt(0).toUpperCase() + hoveredEvent.type.slice(1)}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-pink-400" />
                            <span className="text-xs">{hoveredEvent.duration}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="h-full p-2 flex flex-col gap-2 overflow-auto scrollbar">
                {/* Header */}
                <div className="p-4 max-[500px]:px-2 h-1/6 text-white lg:pt-8 w-full bg-[#171717] z-10 text-3xl flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                        {/* Back button for mobile event details OR desktop back to events */}
                        {windowWidth < 768 && showEventDetails ? (
                            <div className="text-white cursor-pointer" onClick={reset}>
                                <ArrowLeft />
                            </div>
                        ) : (
                            <button 
                                onClick={() => navigate(ERouterPaths.EVENTS)}
                                className="text-white hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-800"
                                title="Back to Events"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        )}
                        <span className="text-2xl md:text-3xl">Event Schedule</span>
                    </div>

                    {/* Day Toggle */}
                    <div className="flex items-center gap-3">                        
                        <div className="flex bg-[#311A49] rounded-lg overflow-hidden">
                            <button
                                onClick={() => setSelectedDay(1)}
                                className={`px-3 md:px-4 py-2 font-semibold transition-colors text-xs md:text-sm ${selectedDay === 1
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                                    : 'text-gray-300 hover:bg-[#3D1F5A]'
                                    }`}
                            >
                                Day One
                            </button>
                            <button
                                onClick={() => setSelectedDay(2)}
                                className={`px-3 md:px-4 py-2 font-semibold transition-colors text-xs md:text-sm ${selectedDay === 2
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                                    : 'text-gray-300 hover:bg-[#3D1F5A]'
                                    }`}
                            >
                                Day Two
                            </button>
                        </div>
                        <button
                            onClick={handleDownload}
                            className="bg-[#311A49] hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 p-3 md:p-3 rounded-lg transition-all duration-200 text-gray-300 hover:text-white group min-w-[48px] min-h-[48px] flex items-center justify-center"
                            title="Download Event Schedule PDF"
                        >
                            <Download className="w-6 h-6 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-wrap overflow-auto scrollbar">
                    <div className={`flex w-full justify-center flex-wrap px-2 md:px-4 lg:p-6 gap-4 max-[500px]:px-1 ${showEventDetails ? 'md:w-1/2' : 'w-full'}`}>

                        {/* Tablet/Desktop: Category-based Timeline */}
                        {windowWidth >= 768 ? (
                            <div className="w-full bg-[#1F102D] rounded-xl p-3 md:p-4 overflow-auto scrollbar-none" style={{ minHeight: '700px', minWidth: '100%' }}>
                                <div className="relative" style={{ minWidth: `${timeSlots.length * 120 + 200}px`, height: `${eventCategories.length * 60 + 60}px` }}>

                                    {/* Fixed Y-axis - Category Labels with increased thickness */}
                                    <div className="absolute left-0 top-0 w-52 bg-[#1F102D] z-20 border-r-4 border-[#5F5959]">
                                        <div className="h-16 border-b border-[#5F59598A] bg-[#1F102D]"></div> {/* Header spacer */}
                                        {eventCategories.map((category, index) => (
                                            <div
                                                key={category}
                                                className="text-gray-300 text-xs md:text-sm flex items-center border-b border-[#5F59598A] pr-2 font-medium bg-[#1F102D] py-2"
                                                style={{ height: '70px' }}
                                            >
                                                <div className="truncate leading-tight" title={category}>{category}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Timeline Container */}
                                    <div className="ml-52">
                                        {/* Fixed X-axis - Time Labels (hourly) */}
                                        <div className="top-0 flex border-b border-[#5F59598A] pb-2 bg-[#1F102D] z-10" style={{ height: '60px' }}>
                                            {timeSlots.map((time, index) => (
                                                <div
                                                    key={time}
                                                    className="text-gray-400 text-xs md:text-sm text-left font-medium flex items-center px-1"
                                                    style={{ width: '120px', minWidth: '120px' }}
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Events Grid */}
                                        <div className="relative" style={{ height: `${eventCategories.length * 70}px` }}>
                                            {currentSchedule.map((event, index) => (
                                                <div
                                                    key={index}
                                                    className={`absolute ${getCategoryColor(event.category)} rounded-lg text-white cursor-pointer hover:opacity-90 transition-all hover:scale-105 border border-white border-opacity-20 flex flex-col justify-center p-2 overflow-hidden shadow-lg`}
                                                    style={{
                                                        left: `${getTimePosition(event.time)}px`,
                                                        top: `${getCategoryPosition(event.category) + 10}px`,
                                                        width: `${getDurationWidth(event.time, event.endTime)}px`,
                                                        height: '50px'
                                                    }}
                                                    onClick={() => handleEventClick(event)}
                                                    onMouseEnter={(e) => handleMouseEnter(event, e)}
                                                    onMouseMove={handleMouseMove}
                                                    onMouseLeave={handleMouseLeave}
                                                >
                                                    <div className="font-semibold text-xs truncate leading-tight" title={event.fullName}>
                                                        {event.fullName}
                                                    </div>
                                                    <div className="text-xs opacity-90 truncate leading-tight" title={event.location}>
                                                        {event.location}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Vertical grid lines */}
                                            {timeSlots.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className="absolute top-0 bottom-0 border-l border-[#5F59598A] opacity-30"
                                                    style={{ left: `${index * 120}px`, width: '1px' }}
                                                />
                                            ))}

                                            {/* Horizontal grid lines */}
                                            {eventCategories.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className="absolute left-0 right-0 border-b border-[#5F59598A] opacity-30"
                                                    style={{ top: `${index * 70}px`, height: '1px' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Mobile: Card Layout */
                            <div className="w-full space-y-3">
                                {currentSchedule.map((event, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#1F102D] rounded-xl p-3 border border-[#5F59598A] cursor-pointer hover:bg-[#311A49] transition-colors"
                                        
                                    >
                                        <div className={`w-full h-1 ${getCategoryColor(event.category)} rounded-full mb-3`}></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-white text-lg">{event.fullName}</h3>
                                            <span className="text-gray-400 text-sm">{event.time}</span>
                                        </div>
                                        <div className="flex items-center text-gray-300 text-sm mb-2">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span className="truncate">{event.category}</span>
                                        </div>
                                        <div className="flex items-center text-gray-300 text-sm mb-2">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-sm">
                                                {event.time} - {event.endTime}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(event.category)} text-white`}>
                                                {event.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Event Details Panel */}
                    {showEventDetails && selectedEvent && (
                        <EventDetailsModal event={selectedEvent} />
                    )}
                </div>
            </div>
        </main>
    );
};

export default EventSchedule;
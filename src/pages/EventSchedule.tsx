import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Download } from 'lucide-react';
import { motion, easeOut } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ERouterPaths } from '@/constants/enum';
import { Button } from '@/components/ui/button';

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

    // One spectrum colour per event family (§3.2) - used only as a small
    // category mark, never as a fill behind text.
    const getCategoryColor = (category) => {
        switch (category) {
            case 'General Events': return 'var(--r6)';
            case 'Data Quest': return 'var(--r5)';
            case 'Tech Triathlon': return 'var(--r4)';
            case 'Math Mania': return 'var(--r2)';
            case 'Breach Point': return 'var(--r1)';
            case 'Game Over': return 'var(--r7)';
            case 'Survivor\'s Court': return 'var(--r3)';
            case 'Q-Factor': return 'var(--ink)';
            default: return 'var(--ink2)';
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

    const CategoryMark = ({ category }: { category: string }) => (
        <span
            aria-hidden="true"
            className="inline-block h-3 w-3 shrink-0 border-2 border-ink"
            style={{ background: getCategoryColor(category) }}
        />
    );

    const EventDetailsModal = ({ event }) => (
        <motion.div
            className="w-full"
            animate={{ x: 0, y: 0 }}
            initial={{ x: -12, y: 12 }}
            transition={{ ease: easeOut, duration: 0.2 }}
        >
            <div className="brut-card p-5">
                <p className="eyebrow flex items-center gap-2 text-ink-2">
                    <CategoryMark category={event.category} />
                    {event.category}
                </p>
                <h2 className="mt-2 font-display text-3xl uppercase leading-[0.9] text-ink">{event.fullName}</h2>
                <div className="mt-4 space-y-3 border-t-2 border-dashed border-line pt-4 text-sm text-ink">
                    <div className="flex items-center">
                        <Clock className="mr-3 h-5 w-5" aria-hidden="true" />
                        <span className="font-mono">{event.time} - {event.endTime}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center">
                            <MapPin className="mr-3 h-5 w-5" aria-hidden="true" />
                            <span>{event.location}</span>
                        </div>
                    )}
                    <div className="flex items-center">
                        <Calendar className="mr-3 h-5 w-5" aria-hidden="true" />
                        <span>Duration: {event.duration} minutes</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="mr-3 h-5 w-5" aria-hidden="true" />
                        <span>Category: {event.category}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="mr-3 h-5 w-5" aria-hidden="true" />
                        <span>Type: {event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const dayTab = (day: number, label: string) => (
        <button
            type="button"
            aria-pressed={selectedDay === day}
            onClick={() => setSelectedDay(day)}
            className={`-mb-[3px] min-h-11 border-2 border-b-[3px] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.08em] transition-colors duration-150 sm:px-5 sm:text-sm ${selectedDay === day
                ? 'border-ink border-b-card bg-card text-ink'
                : 'border-transparent border-b-ink text-ink-2 hover:text-ink'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="brut-container pb-20 pt-8 md:pt-10">
            {/* Hover preview (desktop enhancement only - every fact is also in the block) */}
            {hoveredEvent && windowWidth >= 768 && (
                <div
                    className="pointer-events-none fixed z-50 w-72 max-w-sm border-2 border-ink bg-card p-4 text-ink shadow-brut-md"
                    style={{
                        left: mousePosition.x + 15,
                        top: mousePosition.y - 10,
                        transform: mousePosition.x > window.innerWidth - 300 ? 'translateX(-100%) translateX(-15px)' : 'none'
                    }}
                >
                    <p className="eyebrow flex items-center gap-2 text-ink-2">
                        <CategoryMark category={hoveredEvent.category} />
                        {hoveredEvent.category}
                    </p>
                    <h3 className="mt-2 font-display text-2xl uppercase leading-[0.9]">{hoveredEvent.fullName}</h3>
                    <div className="mt-3 space-y-2 border-t-2 border-dashed border-line pt-3 text-xs">
                        <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
                            <span className="font-mono">{hoveredEvent.time} - {hoveredEvent.endTime}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
                            <span>{hoveredEvent.location}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                            <span>{hoveredEvent.type.charAt(0).toUpperCase() + hoveredEvent.type.slice(1)}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
                            <span className="font-mono">{hoveredEvent.duration}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="flex flex-col items-start justify-between gap-6 border-b-2 border-ink pb-6 sm:flex-row sm:items-end">
                <div>
                    {/* Back button for mobile event details OR back to events */}
                    {windowWidth < 768 && showEventDetails ? (
                        <Button variant="secondary" size="sm" onClick={reset}>
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            Back to schedule
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(ERouterPaths.EVENTS)}
                            title="Back to Events"
                        >
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            Back to Events
                        </Button>
                    )}
                    <p className="eyebrow mt-6 text-ink-2">Axios · Timetable</p>
                    <h1 className="display-title registration mt-2">Event Schedule</h1>
                </div>

                <Button
                    variant="secondary"
                    onClick={handleDownload}
                    title="Download Event Schedule PDF"
                >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download PDF
                </Button>
            </header>

            {/* Day tabs on a heavy rule */}
            <div role="group" aria-label="Day" className="mt-8 flex gap-x-1 border-b-[3px] border-ink">
                {dayTab(1, 'Day One')}
                {dayTab(2, 'Day Two')}
            </div>

            {/* Main Content */}
            <div className="mt-8">
                {showEventDetails && selectedEvent ? (
                    <EventDetailsModal event={selectedEvent} />
                ) : windowWidth >= 768 ? (
                    /* Tablet/Desktop: Category-based Timeline */
                    <div className="scrollbar w-full overflow-auto border-2 border-ink bg-wcard shadow-brut-md">
                        <div className="relative" style={{ minWidth: `${timeSlots.length * 120 + 208}px`, height: `${eventCategories.length * 70 + 60}px` }}>

                            {/* Fixed Y-axis - Category Labels */}
                            <div className="absolute left-0 top-0 z-20 w-52 border-r-2 border-ink bg-card">
                                <div className="flex items-end border-b-2 border-ink px-3 pb-2" style={{ height: '60px' }}>
                                    <span className="eyebrow text-ink-2">Event</span>
                                </div>
                                {eventCategories.map((category) => (
                                    <div
                                        key={category}
                                        className="flex items-center gap-2 border-b border-line px-3 text-sm font-bold text-ink"
                                        style={{ height: '70px' }}
                                    >
                                        <CategoryMark category={category} />
                                        <div className="truncate leading-tight" title={category}>{category}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Timeline Container */}
                            <div className="ml-52">
                                {/* X-axis - Time Labels (hourly) */}
                                <div className="flex border-b-2 border-ink" style={{ height: '60px' }}>
                                    {timeSlots.map((time) => (
                                        <div
                                            key={time}
                                            className="flex items-end px-1 pb-2 font-mono text-xs font-bold text-ink"
                                            style={{ width: '120px', minWidth: '120px' }}
                                        >
                                            {time}
                                        </div>
                                    ))}
                                </div>

                                {/* Events Grid */}
                                <div className="relative" style={{ height: `${eventCategories.length * 70}px` }}>
                                    {/* Vertical grid lines */}
                                    {timeSlots.map((_, index) => (
                                        <div
                                            key={index}
                                            className="absolute bottom-0 top-0 border-l border-dashed border-line"
                                            style={{ left: `${index * 120}px`, width: '1px' }}
                                        />
                                    ))}

                                    {/* Horizontal grid lines */}
                                    {eventCategories.map((_, index) => (
                                        <div
                                            key={index}
                                            className="absolute left-0 right-0 border-b border-line"
                                            style={{ top: `${(index + 1) * 70}px`, height: '1px' }}
                                        />
                                    ))}

                                    {currentSchedule.map((event, index) => (
                                        <div
                                            key={index}
                                            className="absolute flex cursor-pointer flex-col justify-center overflow-hidden border-2 border-ink bg-card py-1.5 pl-3 pr-2 text-ink transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-sm"
                                            style={{
                                                left: `${getTimePosition(event.time)}px`,
                                                top: `${getCategoryPosition(event.category) + 10}px`,
                                                width: `${getDurationWidth(event.time, event.endTime)}px`,
                                                height: '50px',
                                                borderLeft: `8px solid ${getCategoryColor(event.category)}`
                                            }}
                                            onClick={() => handleEventClick(event)}
                                            onMouseEnter={(e) => handleMouseEnter(event, e)}
                                            onMouseMove={handleMouseMove}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div className="truncate text-xs font-bold leading-tight" title={event.fullName}>
                                                {event.fullName}
                                            </div>
                                            <div className="truncate font-mono text-[11px] leading-tight text-ink-2" title={event.location}>
                                                {event.location}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Mobile: Card Layout */
                    <ul className="w-full space-y-4">
                        {currentSchedule.map((event, index) => (
                            <li
                                key={index}
                                className="border-2 border-ink bg-card p-4 text-ink shadow-brut-sm"
                                style={{ borderLeft: `8px solid ${getCategoryColor(event.category)}` }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-lg font-bold leading-tight">{event.fullName}</h3>
                                    <span className="shrink-0 border-2 border-ink bg-wcard px-1.5 py-0.5 font-mono text-xs font-bold">{event.time}</span>
                                </div>
                                <div className="mt-3 flex items-center text-sm text-ink-2">
                                    <Calendar className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                                    <span className="truncate">{event.category}</span>
                                </div>
                                <div className="mt-1.5 flex items-center text-sm text-ink-2">
                                    <MapPin className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t-2 border-dashed border-line pt-3">
                                    <span className="font-mono text-sm">
                                        {event.time} - {event.endTime}
                                    </span>
                                    <span className="eyebrow border-2 border-ink px-2 py-0.5">
                                        {event.type}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EventSchedule;

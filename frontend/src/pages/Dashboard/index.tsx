import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FiPower, FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    NextAppointment,
    Section,
    Appointment,
    Calendar,
} from './styles';


import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/authContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';

interface MonthAvailabilityData {
    day: number;
    available: boolean;
}

interface Appointment {
    id: string;
    date: string;
    hoursFormatted: string;
    user: {
        name: string;
        avatar_url: string;

    }
}

const Dashboard: React.FC = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityData[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const { singOut, user } = useAuth();

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {

        if (modifiers.available && !modifiers.disabled) {
            setSelectedDate(day);

        }
    }, []);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            }
        }).then(res => {
            setMonthAvailability(res.data);
        });
    }, [currentMonth, user.id]);

    useEffect(() => {
        api.get<Appointment[]>('/appointments/me', {
            params: {

                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            },
        }).then(response => {

            const appointmentsFormatted = response.data.map(appointment => {

                return {
                    ...appointment,
                    hoursFormatted: format(parseISO(appointment.date), 'HH:mm'),
                }
            })
            console.log(appointmentsFormatted)

            setAppointments(appointmentsFormatted);
        })
    }, [selectedDate]);

    const disableDays = useMemo(() => {

        const dates = monthAvailability
            .filter(monthDay => monthDay.available === false)
            .map(monthDay => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();
                return new Date(year, month, monthDay.day)
            });

        return dates;

    }, [monthAvailability, currentMonth]);

    const selectedDayAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM ", {
            locale: ptBR
        })
    }, [selectedDate]);

    const selectedWeekDay = useMemo(() => {
        return format(selectedDate, "cccc ", {
            locale: ptBR
        })
    }, [selectedDate]);

    const morningAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() < 12;
        });
    }, [appointments]);

    const affternoonAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() >= 12;
        });
    }, [appointments]);

    const nextAppointment = useMemo(() => {
        return appointments.find(appointment =>
            isAfter(parseISO(appointment.date), new Date())
        )
    }, [appointments]);


    return (

        <Container>
            <Header>
                <HeaderContent >
                    <img src={logo} alt="Logo" />

                    <Profile>
                        <img src={user.avatar_url} alt={user.name} />
                        <div>
                            <span>Bem vindo, </span>
                            <Link to="/profile" >
                                <strong>{user.name}</strong>
                            </Link>
                        </div>
                    </Profile>

                    <button type="button" onClick={singOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Horarios agendados: </h1>

                    <p>
                        {isToday(selectedDate) && <span> Hoje</span>}
                        <span>{selectedDayAsText}</span>
                        <span>{selectedWeekDay}</span>
                    </p>

                    {isToday(selectedDate) && nextAppointment && (

                        <NextAppointment>

                            <strong>Atendimento a seguir</strong>
                            <div>
                                <img
                                    src={nextAppointment.user.avatar_url}
                                    alt={nextAppointment.user.name} />

                                <strong>{nextAppointment.user.name}</strong>
                                <span>
                                    <FiClock />
                                    {nextAppointment.hoursFormatted}
                                </span>

                            </div>
                        </NextAppointment>

                    )}

                    <Section>
                        <strong>Manha</strong>

                        {morningAppointments.length === 0 && (
                            <p>Nenhum agendamento para este periodo</p>
                        )}

                        {morningAppointments.map(appointment => (

                            <Appointment key={appointment.id}>
                                <span>
                                    <FiClock />
                                    {appointment.hoursFormatted}
                                </span>

                                <div>
                                    <img
                                        src={appointment.user.avatar_url}
                                        alt={appointment.user.name} />

                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>

                    <Section>
                        <strong>Tarde</strong>

                        {affternoonAppointments.length === 0 && (
                            <p>Nenhum agendamento para este periodo</p>
                        )}

                        {affternoonAppointments.map(appointment => (

                            <Appointment key={appointment.id} >
                                <span>
                                    <FiClock />
                                    {appointment.hoursFormatted}

                                </span>

                                <div>
                                    <img src={appointment.user.avatar_url} alt={appointment.user.name} />
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}

                    </Section>
                </Schedule>
                <Calendar >
                    <DayPicker
                        weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                        fromMonth={new Date()}
                        disabledDays={[{ daysOfWeek: [0, 6] }, ...disableDays]}
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5] }
                        }}
                        onMonthChange={handleMonthChange}
                        selectedDays={selectedDate}
                        onDayClick={handleDateChange}
                        months={[
                            'Janeiro',
                            'Fevereiro',
                            'Março',
                            'Abril',
                            'Maio',
                            'Junho',
                            'Julho',
                            'Agosto',
                            'Setembro',
                            'Outubro',
                            'Novembro',
                            'Dezembro',
                        ]}
                    />
                </Calendar>
            </Content>
        </Container>
    )
}

export default Dashboard;
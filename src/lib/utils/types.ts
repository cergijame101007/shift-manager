export type ShiftEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    note?: string;
};

export type IssuedIdData = {
    issued_id: string;
    id: string;
    used: boolean;
    user_id: string | null;
    created_at: string;
    users?: {
        name: string
    } | null
}

export type CalendarProps = {
    events: ShiftEvent[];
    onDateClick: (info: any) => void;
    onEventClick: (info: any) => void;
};

export type ModalProps = {
    date: string;
    startTime: string;
    endTime: string;
    note: string;
    selectedEvent: ShiftEvent | null;
    setStartTime: (time: string) => void;
    setEndTime: (time: string) => void;
    setNote: (note: string) => void;
    setShowModal: (show: boolean) => void;
    handleAddShift: () => void;
    handleEditShift: () => void;
    handleDeleteShift: () => void;
}

export type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}
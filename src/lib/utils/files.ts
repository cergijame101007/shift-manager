// 指定された日付文字列から曜日を取得する関数
export const getWeekday = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return new Intl.DateTimeFormat('ja-JP', options).format(date);
}

// 時間のバリデーションチェック
export const isValidTime = (start: Date, end: Date): boolean => {
    return start < end;
}

// 09:00～21:00で15分刻みの時間配列
export const generateTimeOptions = (): string[] => {
    const timeOptions: string[] = [];
    for (let hour = 9; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            timeOptions.push(time);
        }
    }
    return timeOptions;
};

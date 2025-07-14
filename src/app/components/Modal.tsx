import { ModalProps } from "@/lib/utils/types"
import Button from "@/app/components/Button"
import { getWeekday, generateTimeOptions } from "@/lib/utils/files";

const Modal: React.FC<ModalProps> = ({
    date,
    startTime,
    endTime,
    note,
    selectedEvent,
    setStartTime,
    setEndTime,
    setNote,
    handleAddShift,
    handleEditShift,
    handleDeleteShift,
    setShowModal
}) => {
    const timeOptions = generateTimeOptions();
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
                <h2 className="text-lg text-black font-bold mb-4">{date}({getWeekday(date)})のシフトを提出</h2>
                <div className="mb-4">
                    <label className="block text-sm text-black font-medium mb-2">開始時間</label>
                    <select className="border text-sm text-black border-gray-700 p-2 rounded w-full mb-2"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    >
                        <option value="">選択してください</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>

                </div>
                <div className="mb-4">
                    <label className="block text-sm text-black font-medium mb-2">終了時間</label>
                    <select className="border text-sm text-black border-gray-700 p-2 rounded w-full mb-2"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    >
                        <option value="">選択してください</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-black font-medium mb-2">備考</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} className="border text-sm text-black border-gray-700 p-2 rounded w-full" />
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={() => setShowModal(false)}
                        className="px-3 py-1 text-black border-gray-700 rounded shadow">
                        キャンセル
                    </Button>
                    {selectedEvent ? (
                        <div>
                            <Button
                                onClick={handleEditShift}
                                className="bg-gray-700 text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition">
                                編集
                            </Button>
                            <Button
                                onClick={handleDeleteShift}
                                className="bg-red-700 text-white py-2 px-4 rounded shadow hover:bg-red-800 transition">
                                削除
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleAddShift}
                            className="bg-gray-700 text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition">
                            確定
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Modal;
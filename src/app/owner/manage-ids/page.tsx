'use client'
const ManageIds = () => {
    const generateIds = async () => {
        const issuedYearStr = new Date().getFullYear().toString();
        const randomNumberStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const issuedId = `UNRS${issuedYearStr}${randomNumberStr}`;

        return issuedId
    }

    const showIds = async () => {
        const id = await generateIds()
        console.log(id);
    }

    return (
        <button onClick={showIds}>
            push
        </button>
    );
}

export default ManageIds
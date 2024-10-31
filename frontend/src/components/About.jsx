
const About = () => {
    return (
        <div className="lg:flex-1 flex flex-col justify-center p-12">
            <h1 className="self-center text-2xl font-bold mb-5">About</h1>
            <p className="text-lg mb-2">Introducing a productivity website designed to optimize your task management using the Eisenhower Matrix. This platform categorizes your to-do tasks into four distinct types:</p>
            <p>1. Important and Urgent</p>
            <p>2. Important and Not Urgent</p>
            <p>3. Not Important and Urgent</p>
            <p>4. Not Important and Not Urgent</p>
            <p className="mt-4 mb-2 font-extrabold text-lg">Key Features:</p>
            <p className="mb-2"><span className="font-bold">Nested Subtasks:</span> Each task can contain an individual list of subtasks, which can also have their own subtasks, allowing for infinite depth.</p>
            <p className="mb-2"><span className="font-bold">CRUD Operations:</span> Easily create, read, update, and delete tasks and subtasks.</p>
            <p className="mb-2"><span className="font-bold">Drag-and-Drop Functionality:</span> Reorder tasks within a list by dragging and dropping them. You can also move tasks between different quadrants of the matrix.</p>
            <p>This comprehensive task management tool helps you prioritize and organize your tasks more effectively, enhancing your productivity.</p>
        </div>
    );
}

export default About;
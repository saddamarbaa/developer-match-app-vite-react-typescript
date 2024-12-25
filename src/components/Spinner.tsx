import spinner from '../assets/spinner.svg'

function Spinner() {
	return (
		<div className="bg-black bg-opacity-50 flex items-center justify-center fixed inset-0 z-50 cursor-wait transition-opacity duration-300 ease-in-out">
			<div className="flex flex-col items-center space-y-2">
				<img
					src={spinner}
					alt="Loading..."
					className="w-24 h-24"
					aria-label="Loading content, please wait..."
				/>
				{/* <p className="text-white text-lg">Loading...</p> */}
			</div>
		</div>
	)
}

export default Spinner

import image from '../../../assets/auth-image.jpg';

export default function AuthImage() {
    return (
        <div className="flex flex-col justify-center items-center h-full w-full px-8">
            <div className="flex items-center flex-col justify-center mb-8 w-full">
                <h2 className="relative font-semibold text-purple-900 leading-snug">
                    <p className='absolute -top-6 -left-6 text-5xl text-purple-700'>❝</p>
                    <span className='text-5xl'>It's not me</span>
                    <br />
                    <span className='text-5xl'>There is no way it's me</span>
                    <br />
                    <span className='text-5xl'>It was me</span>
                </h2>
                <p className="mt-2 text-purple-700 text-left flex items-start">
                    —
                    <a href="https://fly.io/blog/" className="underline">
                        Nymph of Darkness®
                    </a>
                </p>
            </div>
            {/* <div className="w-full flex justify-end">
                <img
                    src={image}
                    alt="Vor2ex sign in illustration"
                    width={1000}
                    height={1000}
                    className="rounded-2xl shadow-lg object-cover"
                />
            </div> */}
        </div>
    );
}
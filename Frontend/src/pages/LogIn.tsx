import NavigateButton from '../components/NavigateButton.tsx'

function LogIn() {
    return (
        <div className="flex h-screen flex-col justify-center drop-shadow-md">
            <div className="flex flex-col items-center gap-[16px] w-fit mx-auto rounded-[32px] px-[64px] py-[32px] bg-[#FEF9FA]">
                <h1>Log In</h1>
                <input
                    type="text"
                    placeholder="username"
                    className="bg-[#F8F9FA] w-[320px] border-2 border-[#DDE2E5] focus: outline-[#024C89] rounded-[16px] px-[16px] py-[4px]"
                />
                <input
                    type="password"
                    placeholder="password"
                    className="bg-[#F8F9FA] w-[320px] border-2 border-[#DDE2E5] focus: outline-[#024C89] rounded-[16px] px-[16px] py-[4px]"
                />
                <NavigateButton label="Log In" href="/dashboard" />
            </div>
        </div>
    )
}

export default LogIn

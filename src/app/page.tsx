
import Link from "next/link";

const prompt = `
Generate me a webpage in react.  This page should be modern looking with base colour of #F8FAFC and accent of #245AA6
It is a daily attendance page for an employee, and it has several distinct features to be made. 
-There's a filter by and group by of the employee based on the selection (company, branch, department, and section) 

\n-A date picker to select the date of attendance data. It can’t be further from today and to facilitate the user, add an arrow left and right to move the date of attendance by one day.
-The columns of the table are "Employee Name, Employee No, Shift, In, Out(Show all the ins and outs for each employee), SH (Shift Hour), WH (Working Hour), HD (Hours Difference), Early OT (An Icon that turns yellow if the employee has an early OT), Paid Lunch (Also an Icon that turns yellow if the employee has paid lunch), Actual OT, Total OT, Pre-Appr OT, Approved OT, Allowance (in MYR), Remark (Remark could be a badge that can indicate/tag the attendance with data such as "late, lateness, late break in, early out or deficit hours". And lastly on the end there's an Icon for approved or pending. This is to indicate the status of the attendance.
 -Show a summarized data of the attendance above the table such as total working hours, total overtime, total lateness, total shift, total hours difference, etc...
-Clicking on any attendance data will pop up a modal that shows the detail of the attendance such as Employee Name, Employee No, Company, Department, Section, Shift, Selected Date of attendance, Detail of attendance in and outs, and the overtime detail. And add a way to close the modal
Create it in one tsx file

`
export default function Home() {
  return (
    <div className="items-center justify-items-center">
      <div className="flex flex-col items-center gap-4 w-full max-w-2xl mt-12">
        <h1 className="text-3xl font-bold text-center">Testing AI capability on UI development.</h1>
        <div className="w-full">
          <label className="block text-sm font-medium mb-2">This is the prompt send to each AI</label>
          <div className="w-full p-4 border rounded-lg min-h-[100px] max-h-[200px] bg-background overflow-y-auto">
            <p className="text-sm">{prompt}</p>
          </div>
        </div>
      </div>
      
      <main className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/cursor"
          >
            Cursor
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/chatgpt"
          >
            ChatGPT
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/claude"
          >
            Claude
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/v0dev"
          >
            V0 Dev
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/boltnew"
          >
            Bolt New
          </Link>
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/replit"
          >
            Replit
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/lovable"
          >
            Lovable
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/windsurf"
          >
            Windsurf
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/deepseek"
          >
            DeepSeek
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/emergent"
          >
            Emergent
          </Link>
        </div>
      </main>
    </div>
  );
}

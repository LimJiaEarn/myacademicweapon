
import Form from '@/components/shared/Form';

const ContributePage = () => {

    const handleSubmit = async (formData : {[key:string]:string}) => {
        "use server"
        console.log("TODO: Submitting Form through a server function..");
        console.table(formData);
    }

    return (
        <div className="flex_col_center ">
            
            <h1 className="font-bold text-2xl text-center">Hello,<br/>thanks for contributing to a greater cause!</h1>

            <p className="text-lg mb-4">Fill up the form!</p>

            <Form
                fieldsConfig = {[
                    {
                        id:"resourceLevel",
                        type:"select",
                        title:"Choose Level",
                        placeholder:"eg: Secondary",
                        options:["Primary", "Secondary", "JC"]
                    },
                    {
                        id:"resourceSubject",
                        type:"select",
                        title:"Choose Subject",
                        placeholder:"eg: Chinese",
                        options:["A Math", "E Math", "English"]
                    },
                    {
                        id:"resourceType",
                        type:"select",
                        title:"Choose Resource Type",
                        placeholder:"eg: Topical Practice",
                        options:["Notes/Summaries", "Yearly Practice Papers", "Topical Practice Papers"]
                    },
                    {
                        id:"resourceUrl",
                        type:"text",
                        title:"URL to your resource",
                        placeholder:"Link to your resource"
                    },
                    {
                        id:"resourceFile",
                        type:"file",
                        title:"File",
                        placeholder:"Link to your resource"
                    },
                    {
                        id:"resourceDesc",
                        type:"textarea",
                        title:"Description/Anything you want to let us know",
                        placeholder:""
                    },
                ]}
                handleSubmit={handleSubmit}
            />




        </div>
    )
}

export default ContributePage
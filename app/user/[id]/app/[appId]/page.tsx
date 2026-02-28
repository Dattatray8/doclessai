import AppModel from "@/models/app.model";
import AppFeatures from "@/components/AppFeatures";
import {Feature} from "@/types/global.types";
import connectDB from "@/lib/db";

export default async function App({params}: { params: { appId: string } }) {
    await connectDB();
    const resolvedParams = await params;
    console.log(resolvedParams.appId);
    const app = await AppModel.findById(resolvedParams.appId).populate("features");
    console.log(app.features);
    const featues = app?.features.map((item: Feature) => ({
        name: item.name,
        description: item.description,
        route: item.route,
        image: item.image,
        elementId: item.elementId
    }));
    return (
        <div className="card">
            <div className="md:card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <p className="input w-full">{app.name}</p>
                    <p className="input w-full">{app.contactEmail}</p>
                </div>

                <p className="textarea w-full mt-4">{app?.description}</p>

                <div className="mt-5">
                    <AppFeatures featues={JSON.stringify(featues, null, 2)}/>
                </div>
            </div>
        </div>
    )
}
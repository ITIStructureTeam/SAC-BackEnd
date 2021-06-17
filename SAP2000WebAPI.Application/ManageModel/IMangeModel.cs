using SAP2000WebAPI.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Application.ManageModel
{
    public interface IMangeModel
    {
        public static bool CheckModelName(string ProjectName)
        {
            return true;
        }

        public static void SaveModel(RootObject ModelDataObject)
        {

        }

        public static SapResults CreateModel(RootObject ModelDataObject)
        {
            SapResults ModelResults = new SapResults();
            return ModelResults;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    //LoadCombinations
    public class LoadCombinations
    {
        public string CombinationID { get; set; }
        public LoadCombinationsDetails Details { get; set; }
    }
}

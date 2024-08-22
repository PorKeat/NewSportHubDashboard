import React, { useEffect } from "react";
import { IoFootballSharp } from "react-icons/io5";
import { FaBasketball, FaVolleyball } from "react-icons/fa6";
import { GiShuttlecock } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStatics,
  selectAllFootballs,
  selectAllBasketballs,
  selectAllVolleyballs,
  selectAllBadmintons,
} from "../../redux/feature/static/StaticSlice";
import StaticChart from "./StaticChart";

export default function Static() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStatics());
  }, [dispatch]);

  const football = useSelector(selectAllFootballs);
  const basketball = useSelector(selectAllBasketballs);
  const volleyball = useSelector(selectAllVolleyballs);
  const badminton = useSelector(selectAllBadmintons);

  return (
    <section className="bg-slate-100">
      <div className="p-4 mt-10 sm:ml-64">
        <div className="rounded-lg dark:border-gray-700">
          {/* grid 4 start */}
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-4 mt-2">
            {/* card 1 */}
            <div className="max-w-full h-44 rounded-lg bg-white p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">
                  Total Football Pitches
                </h2>
                <IoFootballSharp className="w-14 h-14 rounded-2xl bg-violet-200 p-2 fill-violet-400 stroke-violet-400" />
              </div>
              <div className="flex-grow"></div> {/* Spacer */}
              <div className="mt-auto">
                <h2 className="text-4xl font-bold">
                  <span>{football.length}</span>
                </h2>
              </div>
            </div>
            {/* card 1 end */}

            {/* card 2 */}
            <div className="max-w-full h-44 rounded-lg bg-white p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">
                  Total Basketball Courts
                </h2>
                <FaBasketball className="w-14 h-14 rounded-2xl bg-yellow-200 p-2 fill-yellow-400 stroke-yellow-400" />
              </div>
              <div className="flex-grow"></div> {/* Spacer */}
              <div className="mt-auto">
                <h2 className="text-4xl font-bold">
                  <span>{basketball.length}</span>
                </h2>
              </div>
            </div>
            {/* card 2 end */}

            {/* card 3 */}
            <div className="max-w-full h-44 rounded-lg bg-white p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">
                  Total Volleyball Courts
                </h2>
                <FaVolleyball className="w-14 h-14 rounded-2xl bg-green-200 p-2 fill-green-400 stroke-green-400" />
              </div>
              <div className="flex-grow"></div> {/* Spacer */}
              <div className="mt-auto">
                <h2 className="text-4xl font-bold">
                  <span>{volleyball.length}</span>
                </h2>
              </div>
            </div>
            {/* card 3 end */}

            {/* card 4 */}
            <div className="max-w-full h-44 rounded-lg bg-white p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">
                  Total Badminton Courts
                </h2>
                <GiShuttlecock className="w-14 h-14 rounded-2xl bg-orange-200 p-2 fill-orange-400 stroke-orange-400" />
              </div>
              <div className="flex-grow"></div> {/* Spacer */}
              <div className="mt-auto">
                <h2 className="text-4xl font-bold">
                  <span>{badminton.length}</span>
                </h2>
              </div>
            </div>
            {/* card 4 end */}
          </div>
          {/* grid 4 end */}

          {/* section 2 */}
          <div className="flex items-center justify-center h-96 mb-4 rounded-lg">
            <StaticChart
              football={football}
              basketball={basketball}
              volleyball={volleyball}
              badminton={badminton}
            />
            {/* const football = useSelector(selectAllFootballs); const basketball =
            useSelector(selectAllBasketballs); const volleyball =
            useSelector(selectAllVolleyballs); const badminton =
            useSelector(selectAllBadmintons); */}
            {/* <StaticChart1 /> */}
          </div>
        </div>
      </div>
    </section>
  );
}

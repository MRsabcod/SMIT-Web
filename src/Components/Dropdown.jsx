import React, { useEffect, useState } from "react";
import {
    FiArrowRight,
    FiBarChart2,
    FiChevronDown,
    FiHome,
    FiPieChart,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const ShiftingDropDown = () => {
    return (
        <div className="flex z-50 w-full justify-start text-neutral-200 md:justify-center">
            <Tabs />
        </div>
    );
};

export default ShiftingDropDown;

const Tabs = () => {
    const [selected, setSelected] = useState(null);
    const [dir, setDir] = useState(null);

    const handleSetSelected = (val) => {
        if (typeof selected === "number" && typeof val === "number") {
            setDir(selected > val ? "r" : "l");
        } else if (val === null) {
            setDir(null);
        }

        setSelected(val);
    };

    return (
        <div
            onMouseLeave={() => handleSetSelected(null)}
            className="relative flex h-fit gap-2 lg:flex-row text-sm lg:text-[16px] w-full items-center flex-col"
        >
            {TABS.map((t) => {
                return (
                    <Tab
                        key={t.id}
                        selected={selected}
                        handleSetSelected={handleSetSelected}
                        tab={t.id}
                    >
                        {t.title}
                    </Tab>
                );
            })}

            <AnimatePresence>
                {selected && <Content dir={dir} selected={selected} />}
            </AnimatePresence>
        </div>
    );
};

const Tab = ({ children, tab, handleSetSelected, selected }) => {
    return (
        <button
            id={`shift-tab-${tab}`}
            onMouseEnter={() => handleSetSelected(tab)}
            onClick={() => handleSetSelected(tab)}
            className={`flex items-center gap-1 rounded-full py-1.5 w-full justify-center md:px-3 text-md transition-colors ${selected === tab
                ? " bg-blue-600 text-neutral-100"
                : "text-black"
                }`}
        >
            <span>{children}</span>
            <FiChevronDown
                className={`transition-transform ${selected === tab ? "rotate-180" : ""
                    }`}
            />
        </button>
    );
};

const Content = ({ selected, dir }) => {
    return (
        <motion.div
            id="overlay-content"
            initial={{
                opacity: 0,
                y: 8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: 8,
            }}
            className="absolute left-0 top-[calc(100%_+_24px)] w-[270px] rounded-lg border border-neutral-200 shadow bg-gradient-to-b from-white via-white to-white p-3"
        >
            <Bridge />
            <Nub selected={selected} />

            {TABS.map((t) => {
                return (
                    <div className="overflow-hidden" key={t.id}>
                        {selected === t.id && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: dir === "l" ? 100 : dir === "r" ? -100 : 0,
                                }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                                <t.Component />
                            </motion.div>
                        )}
                    </div>
                );
            })}
        </motion.div>
    );
};

const Bridge = () => (
    <div className="absolute -top-[24px] left-0 right-0 h-[24px]" />
);

const Nub = ({ selected }) => {
    const [left, setLeft] = useState(0);

    useEffect(() => {
        moveNub();
    }, [selected]);

    const moveNub = () => {
        if (selected) {
            const hoveredTab = document.getElementById(`shift-tab-${selected}`);
            const overlayContent = document.getElementById("overlay-content");

            if (!hoveredTab || !overlayContent) return;

            const tabRect = hoveredTab.getBoundingClientRect();
            const { left: contentLeft } = overlayContent.getBoundingClientRect();

            const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;

            setLeft(tabCenter);
        }
    };

    return (
        <motion.span
            style={{
                clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
            }}
            animate={{ left }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-neutral-600"
        />
    );
};

const Courses = () => {
    const { courses } = useSelector(state => state.courses);

    return (
        <div>
            {
                courses?.length > 0 ? (
                    courses?.map((item, index) => {
                        return (
                            <>
                                <Link to={`/apply/${item.id}`} key={index} onClick={() => window.reload()}>
                                    <button className="text-black h-full w-full py-3 transition rounded text-sm hover:bg-gray-100 hover:text-blue-600 my-2">{item.title}</button>
                                </Link>
                            </>
                        )
                    })
                )
                    :
                    <div className="text-center text-black">No Results</div>
            }
        </div>
    );
};

const QuickLinks = () => {
    return (
        <div>
            <Link to="https://www.saylaniwelfare.com/en" target="_blank">
                <button className="text-black h-full w-full py-3 transition rounded text-sm hover:bg-gray-100 hover:text-blue-600 my-2">Saylani Website</button>
            </Link>
            <Link to="https://student.saylaniwelfare.com/dashboard" target="_blank">
                <button className="text-black h-full w-full py-3 transition rounded text-sm hover:bg-gray-100 hover:text-blue-600 my-2">SMIT Website</button>
            </Link>
        </div >
    );
};

const TABS = [
    {
        title: "Courses",
        Component: Courses,
    },
    {
        title: "Links",
        Component: QuickLinks,
    },
].map((n, idx) => ({ ...n, id: idx + 1 }));
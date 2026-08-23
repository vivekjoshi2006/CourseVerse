import React, { useState } from 'react';
import {
  ArrowUpRight, BookOpenCheck, Bookmark, BookmarkCheck, Check, Clock4, ExternalLink, GraduationCap, Layers3, Scale, ShieldCheck, Sparkles, Star, X, ArrowLeftRight
} from 'lucide-react';

const LessonList = ({
  courses = [],
  bookmarks = [],
  compareList = [],
  onToggleBookmark,
  onToggleCompare,
  onClearFilters
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white border border-indigo-100 rounded-2xl p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
          <Layers3 size={22} />
        </div>
        <h3 className="text-[15px] font-bold text-indigo-950">No matching tracks found</h3>
        <p className="text-[15px] text-indigo-600/70 mt-1 font-bold max-w-sm mx-auto leading-relaxed">
          Try resetting your domain filters or search for another technical topic.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-semibold rounded-xl transition shadow-sm"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => {
          const isSaved = bookmarks.includes(course.id);
          const isCompared = compareList.some((c) => c.id === course.id);

          return (
            <article
              key={course.id || `course-${idx}`}
              className={`cv-card flex flex-col overflow-hidden relative ${isCompared ? 'ring-2 ring-indigo-500' : ''
                }`}
            >
              {/* Header Banner */}
              <div
                className="p-5 text-white relative flex flex-col justify-between h-36"
                style={{ background: course.gradient || 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                <div className="flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-2">
                    <span className="inline-block text-[14px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                      {course.provider}
                    </span>
                    {course.tag && (
                      <span className="inline-flex items-center gap-1 text-[14px] font-semibold px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-white border border-white/20">
                        <Sparkles size={14} className="text-amber-200" />
                        {course.tag}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(course.id)}
                    aria-label={isSaved ? 'Remove from saved' : 'Save course'}
                    className={`p-2 rounded-full backdrop-blur-md transition ${isSaved
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'bg-white/20 text-white/90 hover:bg-white/30 hover:text-white'
                      }`}
                  >
                    {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </button>
                </div>

                <div className="z-10 flex items-end justify-between gap-2">
                  <div className="flex flex-col items-start gap-1">
                    <span className="inline-block px-2.5 py-0.5 text-[14px] font-bold rounded-full bg-white/90 text-purple-900 uppercase tracking-wider shadow-sm">
                      Curriculum
                    </span>
                    <h4 className="inline-block text-[15px] font-bold text-white drop-shadow-sm">
                      {course.subcategory || 'General Track'}
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20">
                    <GraduationCap size={17} />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-block text-[13px] font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      {course.subcategory || 'Tech'}
                    </span>
                    <span className={`inline-block text-[13px] font-bold px-2.5 py-0.5 rounded-md ${course.isFree ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                      {course.isFree ? 'Free' : 'Paid'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[13px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <Star size={11} className="fill-indigo-600 text-indigo-600" />
                      {course.rating || '4.8'}
                    </span>
                    {course.duration && (
                      <span className="inline-flex items-center gap-1 text-[13px] font-bold px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 mb-2">
                        <Clock4 size={12} className="text-sky-600" /> {course.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-[15px] text-indigo-950 mb-2 leading-snug" title={course.title}>
                    {course.title}
                  </h3>

                  {/* Description block */}
                  <p className="text-[14px] text-indigo-900/70 leading-relaxed mb-4">
                    {course.description}
                  </p>
                </div>

                <div>
                  {/* Syllabus */}
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    className="w-full flex items-center justify-between text-[14px] font-semibold text-indigo-600 hover:text-indigo-800 py-1.5 mb-3 group transition-colors"
                  >
                    <span className="flex items-center gap-1.5 font-bold">
                      <BookOpenCheck size={15} /> View Syllabus Highlights
                    </span>
                    <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-50">
                    <button
                      type="button"
                      onClick={() => onToggleCompare(course)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[15px] font-semibold border transition ${isCompared
                        ? 'bg-purple-100 border-purple-300 text-purple-900 shadow-sm'
                        : 'bg-purple-50/60 border-purple-200 text-purple-800 hover:bg-purple-100/70'
                        }`}
                    >
                      {isCompared ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : (
                        <>
                          <ArrowLeftRight size={14} /> Compare
                        </>
                      )}
                    </button>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[15px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
                    >
                      Launch <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Syllabus Detail Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 bg-indigo-950/20 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl border border-indigo-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-2 w-full"
              style={{ background: selectedCourse.gradient || 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-indigo-100 text-indigo-900">
                    {selectedCourse.provider}
                  </span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-purple-50 text-purple-800 border border-purple-100">
                    {selectedCourse.subcategory || selectedCourse.category}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="p-1 rounded-lg text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="text-[16px] font-bold text-indigo-950 mb-2">{selectedCourse.title}</h3>
              <p className="text-[14px] text-indigo-900/70 leading-relaxed mb-6">{selectedCourse.description}</p>

              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-6">
                <h4 className="text-[13px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Sparkles size={14} className="text-indigo-600" /> Syllabus Highlights
                </h4>
                <ul className="space-y-2.5">
                  {(
                    selectedCourse.highlights || [
                      'Comprehensive foundational-to-advanced curriculum',
                      'Direct hands-on interactive programming exercises',
                      'Verified open-access educational track',
                    ]
                  ).map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[13px] text-indigo-900">
                      <ShieldCheck size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={selectedCourse.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[14px] font-bold transition shadow-sm"
              >
                Launch Course on {selectedCourse.provider}
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LessonList;
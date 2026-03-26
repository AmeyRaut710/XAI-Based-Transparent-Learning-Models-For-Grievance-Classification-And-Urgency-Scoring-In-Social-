import React, { useRef, useState } from 'react';
import { AnalysisResult, Sentiment, Urgency } from '../types';
import CategoryChart from './charts/CategoryChart';
import SentimentChart from './charts/SentimentChart';
import UrgencyChart from './charts/UrgencyChart';
import AnalysisTable from './AnalysisTable';
import { Download, Share2, Loader2 } from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface Props {
  data: AnalysisResult[];
  isLoading: boolean;
  topic: string;
}

const Dashboard: React.FC<Props> = ({ data, isLoading, topic }) => {
  const chartsRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 animate-pulse">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="font-medium text-lg">AI is analyzing comments...</p>
        <p className="text-sm opacity-70">Detecting sentiment, urgency, and categories</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-600">Ready to Analyze</h2>
        <p className="max-w-md text-center mt-2">Enter a topic above (e.g., "Drinking Water", "State Bank of India") to start the AI analysis.</p>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (!chartsRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPos = margin;

      const addFooter = () => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`InsightStream Report | ${topic} | Page ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      };

      const checkNewPage = (heightNeeded: number) => {
        if (yPos + heightNeeded > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
          addFooter();
          return true;
        }
        return false;
      };

      // 1. Header
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 80);
      doc.text("Social Listening Intelligence Report", margin, yPos);
      yPos += 10;
      
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text(`Subject: ${topic.toUpperCase()}`, margin, yPos);
      yPos += 6;
      doc.setFontSize(10);
      doc.text(`Analysis Date: ${new Date().toLocaleString()}`, margin, yPos);
      yPos += 10;

      // 2. Visual Overview (Charts)
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Visual Analytics Overview", margin, yPos);
      yPos += 5;

      const canvas = await html2canvas(chartsRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      
      doc.addImage(imgData, 'PNG', margin, yPos, contentWidth, imgHeight);
      yPos += imgHeight + 15;

      // 3. Executive Summary
      const highCount = data.filter(i => i.urgency === Urgency.High).length;
      const total = data.length;
      const topCategory = data.reduce((a, b, i, arr) => 
        (arr.filter(v => v.category === a).length >= arr.filter(v => v.category === b.category).length ? a : b.category), data[0]?.category || '');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Executive Summary", margin, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const summaryText = `This report provides an in-depth analysis of feedback for "${topic}" across ${total} records. ` +
        `The most frequent concern category is "${topCategory}". ` +
        `Our analysis identifies ${highCount} critical alerts requiring immediate attention. The following sections provide segmented details by Priority and Sentiment.`;

      const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
      doc.text(splitSummary, margin, yPos);
      yPos += (splitSummary.length * 6) + 15;

      addFooter();

      // Helper to render sections
      const renderSection = (title: string, items: AnalysisResult[], color: [number, number, number]) => {
        if (items.length === 0) return;

        checkNewPage(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(title, margin, yPos);
        yPos += 12; // Increased spacing since line is removed

        items.forEach((item, index) => {
          const safeText = item.originalText.replace(/[^\x20-\x7E]/g, '');
          const safeAnalysis = item.explanation.replace(/[^\x20-\x7E]/g, '');
          
          const header = `${index + 1}. [${item.category}] - ${item.location || 'India'} (${item.sentiment} | ${item.urgency})`;
          const body = `Content: ${safeText}`;
          const analysisLine = `AI Context: ${safeAnalysis}`;

          const headerLines = doc.splitTextToSize(header, contentWidth);
          const bodyLines = doc.splitTextToSize(body, contentWidth);
          const analysisLines = doc.splitTextToSize(analysisLine, contentWidth);
          
          const blockHeight = (headerLines.length + bodyLines.length + analysisLines.length) * 5 + 10;

          if (checkNewPage(blockHeight)) {
             // Block moved to new page
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          doc.text(headerLines, margin, yPos);
          yPos += headerLines.length * 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(bodyLines, margin, yPos);
          yPos += bodyLines.length * 5;

          doc.setFont("helvetica", "italic");
          doc.setFontSize(9);
          doc.setTextColor(color[0], color[1], color[2]);
          doc.text(analysisLines, margin, yPos);
          yPos += analysisLines.length * 5 + 8;
        });
        
        yPos += 10;
      };

      // Segment Data for Urgency Sections
      const highPriority = data.filter(d => d.urgency === Urgency.High);
      const mediumPriority = data.filter(d => d.urgency === Urgency.Medium);
      const lowPriority = data.filter(d => d.urgency === Urgency.Low);

      // Segment Data for Sentiment Sections
      const positiveFeedback = data.filter(d => d.sentiment === Sentiment.Positive);
      const negativeFeedback = data.filter(d => d.sentiment === Sentiment.Negative);
      const neutralFeedback = data.filter(d => d.sentiment === Sentiment.Neutral);

      // Render Urgency Sections
      renderSection("SECTION 1: HIGH PRIORITY COMPLAINTS", highPriority, [180, 0, 0]);
      renderSection("SECTION 2: MEDIUM PRIORITY COMPLAINTS", mediumPriority, [217, 119, 6]);
      renderSection("SECTION 3: LOW PRIORITY COMPLAINTS", lowPriority, [37, 99, 235]);

      // Render Sentiment Sections
      renderSection("SECTION 4: POSITIVE FEEDBACK & APPRECIATION", positiveFeedback, [5, 150, 105]);
      renderSection("SECTION 5: NEGATIVE FEEDBACK & RANTS", negativeFeedback, [220, 38, 38]);
      renderSection("SECTION 6: NEUTRAL OBSERVATIONS", neutralFeedback, [100, 116, 139]);

      doc.save(`InsightStream_Full_Analysis_${topic.replace(/\s+/g, '_')}.pdf`);

    } catch (err) {
      console.error("PDF Generation failed", err);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Header Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Results for "{topic}"</h2>
          <p className="text-gray-500">Analyzed {data.length} public records</p>
        </div>
        <div className="flex gap-2">
           <button 
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-wait"
             onClick={handleDownloadPDF}
             disabled={isGeneratingPdf}
           >
             {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
             {isGeneratingPdf ? "Generating Comprehensive Report..." : "Export Full Analysis PDF"}
           </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div ref={chartsRef} className="bg-gray-50 p-2 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-[320px]">
            <SentimentChart data={data} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-[320px]">
            <UrgencyChart data={data} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-[320px]">
            <CategoryChart data={data} />
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="h-[500px]">
        <AnalysisTable data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
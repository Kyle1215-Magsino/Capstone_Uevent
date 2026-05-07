import { useRef } from 'react';
import Barcode from 'react-barcode';
import Modal from './Modal';

export default function BarcodeModal({ event, onClose }) {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=800,height=600');
    windowPrint.document.write(`
      <html>
        <head>
          <title>Print Event Barcode - ${event.event_name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .barcode-container {
              text-align: center;
              border: 2px solid #10b981;
              padding: 30px;
              border-radius: 12px;
              background: white;
            }
            .event-info {
              margin-bottom: 20px;
            }
            .event-name {
              font-size: 28px;
              font-weight: bold;
              color: #111827;
              margin-bottom: 8px;
            }
            .event-date {
              font-size: 16px;
              color: #6b7280;
              margin-bottom: 4px;
            }
            .event-venue {
              font-size: 14px;
              color: #9ca3af;
            }
            .barcode-wrapper {
              margin: 20px 0;
            }
            .barcode-text {
              font-size: 14px;
              color: #6b7280;
              margin-top: 10px;
              font-weight: bold;
            }
            @media print {
              body {
                padding: 0;
              }
              .barcode-container {
                border: 2px solid #10b981;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 250);
  };

  if (!event) return null;

  const barcodeValue = `EVENT-${event.id}`;

  return (
    <Modal open={!!event} onClose={onClose} title="Event Check-In Barcode" maxWidth="max-w-2xl">
      <div className="p-6">
        <div ref={printRef}>
          <div className="barcode-container text-center border-2 border-green-500 rounded-xl p-8 bg-white dark:bg-gray-800">
            <div className="event-info mb-6">
              <h2 className="event-name text-3xl font-bold text-gray-900 mb-3">
                {event.event_name}
              </h2>
              <p className="event-date text-lg text-gray-600 mb-2">
                {new Date(event.event_date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="event-venue text-base text-gray-500">
                📍 {event.venue}
              </p>
            </div>

            <div className="barcode-wrapper flex justify-center">
              <Barcode
                value={barcodeValue}
                format="CODE128"
                width={3}
                height={100}
                displayValue={true}
                fontSize={18}
                margin={10}
              />
            </div>

            <p className="barcode-text text-sm text-gray-700 mt-4 font-semibold">
              Scan this barcode to check in
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Barcode
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
            <strong>💡 How it works:</strong>
          </p>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>Print this barcode and display it at the event venue</li>
            <li>Students scan it using the mobile app</li>
            <li>Each student gets checked in with their own account</li>
            <li>All check-ins appear in the Live Feed</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

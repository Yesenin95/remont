"use client";

import { useState, useEffect } from "react";
import { UserRole } from "@/types/roles";

interface RepairRequest {
  id: string;
  customerName: string;
  phone: string;
  deviceModel: string;
  problem: string;
  status: string;
  repairStage: string;
  requestNumber: string;
  notes: string | null;
  createdAt: string;
  assignedMaster: { id: string; name: string } | null;
  service: { name: string };
}

interface RepairRequestsTableProps {
  initialRequests: RepairRequest[];
  userRole: UserRole;
  userId: string;
}

const STAGE_LABELS: Record<string, string> = {
  DIAGNOSTICS: "Диагностика",
  REPAIR: "Ремонт",
  READY: "Готов к выдаче",
  ISSUED: "Выдан",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "В ожидании",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершено",
  CANCELLED: "Отменено",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function RepairRequestsTable({
  initialRequests,
  userRole,
  userId,
}: RepairRequestsTableProps) {
  const [requests, setRequests] = useState<RepairRequest[]>(initialRequests);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null);
  const [showMessages, setShowMessages] = useState(false);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/repairs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status } : req))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const updateStage = async (id: string, repairStage: string) => {
    try {
      const res = await fetch(`/api/repairs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repairStage }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, repairStage } : req))
        );
      }
    } catch (error) {
      console.error("Error updating stage:", error);
    }
  };

  const assignToMe = async (id: string) => {
    try {
      const res = await fetch(`/api/repairs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: userId }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, assignedMaster: { id: userId, name: "Вы" } } : req
          )
        );
      }
    } catch (error) {
      console.error("Error assigning:", error);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Вы уверены?")) return;

    try {
      const res = await fetch(`/api/repairs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRequests((prev) => prev.filter((req) => req.id !== id));
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Номер
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Клиент
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Устройство
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Стадия
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Мастер
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono font-bold text-blue-600">
                    {request.requestNumber}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.customerName}
                  </div>
                  <div className="text-sm text-gray-500">{request.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.deviceModel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={request.status}
                    onChange={(e) => updateStatus(request.id, e.target.value)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      STATUS_COLORS[request.status]
                    } border-0 cursor-pointer`}
                    disabled={userRole === "USER"}
                  >
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={request.repairStage || "DIAGNOSTICS"}
                    onChange={(e) => updateStage(request.id, e.target.value)}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border-0 cursor-pointer"
                    disabled={userRole === "USER"}
                  >
                    {Object.entries(STAGE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.assignedMaster?.name || "Не назначен"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {userRole !== "USER" && !request.assignedMaster && (
                    <button
                      onClick={() => assignToMe(request.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Взять
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowMessages(true);
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    Чат
                  </button>
                  {userRole === "OWNER" && (
                    <button
                      onClick={() => deleteRequest(request.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Нет заявок
        </div>
      )}

      {showMessages && selectedRequest && (
        <MessageModal
          request={selectedRequest}
          onClose={() => {
            setShowMessages(false);
            setSelectedRequest(null);
          }}
          userId={userId}
        />
      )}
    </div>
  );
}

// Компонент модального окна сообщений
function MessageModal({
  request,
  onClose,
  userId,
}: {
  request: RepairRequest;
  onClose: () => void;
  userId: string;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [request.id]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?repairRequestId=${request.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          repairRequestId: request.id,
          senderId: userId,
        }),
      });

      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              Заявка #{request.requestNumber}
            </h3>
            <p className="text-sm text-gray-500">
              {request.deviceModel} • {request.customerName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  msg.senderId === userId
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleString("ru-RU")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Введите сообщение..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

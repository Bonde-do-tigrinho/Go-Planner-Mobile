import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.15.10:8082/api";

// ===== TIPOS DA API (Backend em Português) =====
export type CreateTripApiRequest = {
  titulo: string;
  localPartida: string;
  localDestino: string;
  dataPartida: string; // ISO 8601
  dataRetorno: string; // ISO 8601
  descricao?: string;
  imagem?: string;
  atividades: Array<{
    titulo: string;
    dataHora: string; // ISO 8601
  }>;
  participantes: string[]; // Array de emails
};

export type UpdateTripApiRequest = {
  titulo: string;
  localPartida: string;
  localDestino: string;
  dataPartida: string; // ISO 8601
  dataRetorno: string; // ISO 8601
  descricao?: string;
};

export type ActivityApiResponse = {
  id: string;
  titulo: string;
  dataHora: string;
  concluida: boolean;
};

export type ParticipantApiResponse = {
  userId: string;
  role: "LEITOR" | "EDITOR";
};

export type UserInfo = {
  id: string;
  nome: string;
  email: string;
  foto?: string | null;
};

export type CreateTripApiResponse = {
  id: string;
  titulo: string;
  localPartida: string;
  localDestino: string;
  dataPartida: string;
  dataRetorno: string;
  descricao: string;
  imagem: string;
  favoritada: boolean;
  atividades: ActivityApiResponse[];
  participantes: ParticipantApiResponse[];
};

// ===== FUNÇÕES DA API =====

/**
 * POST /api/trips/create-trip
 * Cria uma nova viagem
 */
export async function createTrip(
  tripData: CreateTripApiRequest
): Promise<CreateTripApiResponse> {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    console.log(
      "📤 Enviando viagem para API:",
      JSON.stringify(tripData, null, 2)
    );

    const response = await fetch(`${API_URL}/trips/create-trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erro da API:", errorData);
      throw new Error(
        errorData.message || errorData.error || "Erro ao criar viagem"
      );
    }

    const data: CreateTripApiResponse = await response.json();
    console.log("✅ Viagem criada com sucesso:", data.id);
    return data;
  } catch (error) {
    console.error("❌ Erro ao criar viagem:", error);
    throw error;
  }
}

/**
 * GET /api/trips/minhas-viagens
 * Busca todas as viagens criadas pelo usuário
 */
export async function getMyTrips(): Promise<CreateTripApiResponse[]> {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch(`${API_URL}/trips/minhas-viagens`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || errorData.error || "Erro ao buscar viagens"
      );
    }

    const data: CreateTripApiResponse[] = await response.json();
    console.log("✅ Viagens carregadas:", data.length);
    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar viagens:", error);
    throw error;
  }
}

/**
 * PATCH /api/trips/{id}
 * Atualiza os dados de uma viagem existente
 */
export async function updateTrip(
  tripId: string,
  tripData: UpdateTripApiRequest
): Promise<CreateTripApiResponse> {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    console.log(
      "📤 Atualizando viagem:",
      tripId,
      JSON.stringify(tripData, null, 2)
    );

    const response = await fetch(`${API_URL}/trips/${tripId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erro da API:", errorData);
      throw new Error(
        errorData.message || errorData.error || "Erro ao atualizar viagem"
      );
    }

    const data: CreateTripApiResponse = await response.json();
    console.log("✅ Viagem atualizada com sucesso:", data.id);
    return data;
  } catch (error) {
    console.error("❌ Erro ao atualizar viagem:", error);
    throw error;
  }
}

/**
 * GET /api/trips
 * Busca todas as viagens do usuário
 */
export async function getUserTrips(): Promise<CreateTripApiResponse[]> {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch(`${API_URL}/trips`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || errorData.error || "Erro ao buscar viagens"
      );
    }

    const data: CreateTripApiResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar viagens:", error);
    throw error;
  }
}

/**
 * GET /api/users/{userId}
 * Busca informações de um usuário pelo ID
 */
export async function getUserById(userId: string): Promise<UserInfo> {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar informações do usuário");
    }

    const data: UserInfo = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    throw error;
  }
}

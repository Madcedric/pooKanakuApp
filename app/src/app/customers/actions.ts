'use server';

import { supabaseServer } from '../../lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function getCustomers() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('customers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
  return data;
}

export async function createCustomer(formData: FormData) {
  const name = formData.get('name') as string;
  const phoneNumber = formData.get('phone_number') as string;
  const address = formData.get('address') as string;
  const category = formData.get('category') as string;
  const dailyRequirement = formData.get('daily_requirement') as string;
  const flowerPreferences = formData.get('flower_preferences') as string;
  const notes = formData.get('notes') as string;

  const sb = supabaseServer();
  const { error } = await sb.from('customers').insert({
    name,
    phone_number: phoneNumber,
    address,
    category,
    daily_requirement: dailyRequirement,
    flower_preferences: flowerPreferences,
    notes,
  });

  if (error) {
    console.error('Error creating customer:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/customers');
  return { success: true };
}

export async function updateCustomer(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const phoneNumber = formData.get('phone_number') as string;
  const address = formData.get('address') as string;
  const category = formData.get('category') as string;
  const dailyRequirement = formData.get('daily_requirement') as string;
  const flowerPreferences = formData.get('flower_preferences') as string;
  const notes = formData.get('notes') as string;

  const sb = supabaseServer();
  const { error } = await sb
    .from('customers')
    .update({
      name,
      phone_number: phoneNumber,
      address,
      category,
      daily_requirement: dailyRequirement,
      flower_preferences: flowerPreferences,
      notes,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating customer:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/customers');
  return { success: true };
}

export async function deleteCustomer(id: string) {
  const sb = supabaseServer();
  const { error } = await sb.from('customers').delete().eq('id', id);

  if (error) {
    console.error('Error deleting customer:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/customers');
  return { success: true };
}

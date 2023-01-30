<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BatchController extends Controller
{
    public function index(Request $request)
    {
        $query = Batch::query();

        $query->where('institute_id', auth()->user()->institute_id);

        if ($search = $request->input('search')) {
            $query->where([['institute_id', '=', auth()->user()->institute_id], ['name', 'like', '%' . $search . '%']])
                ->orWhere([['institute_id', '=', auth()->user()->institute_id], ['code', 'like', '%' . $search . '%']]);
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->select('id', 'institute_id', 'name', 'code')
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function all()
    {
        $query = Batch::query();

        if (!auth()->user()->hasRole('SA') && !auth()->user()->hasRole('OT')) {
            $query->where('institute_id', auth()->user()->institute_id);
        }

        $data = $query->select('id', 'institute_id', 'name')
                    ->get();

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = Batch::select('id', 'institute_id', 'name', 'code')
                            ->where('id', $id)
                            ->first();

        if (!$data) return $this->responseFailed('Batch not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string',
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $data = Batch::create(array_merge(
            $validator->validated(),
            [
                'institute_id' => auth()->user()->institute_id
            ]
        ));

        return $this->responseSuccess('Batch successfully created', $data, 201);
    }

    public function update(Request $request, $id)
    {
        $batch = Batch::where('id', $id)->first();
        if (!$batch) return $this->responseFailed('Batch not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string',
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $batch->update($validator->validated());

        $data = Batch::find($id);

        return $this->responseSuccess('Batch successfully updated', $data, 200);
    }

    public function destroy($id)
    {
        $batch = Batch::where('id', $id)->first();
        if (!$batch) return $this->responseFailed('Batch not found', '', 404);

        $batch->delete();

        return $this->responseSuccess('Batch successfully deleted');
    }
}
